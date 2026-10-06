/**
 * Console-error audit: loads every route in headless Chromium, collects
 * console errors/warnings and page errors. Run: node scripts/audit-console.mjs
 */
import { chromium } from "playwright";

const BASE = "http://localhost:4198";
const ROUTES = ["/", "/research", "/work", "/lab", "/notes", "/publications", "/about", "/nope"];

const browser = await chromium.launch();
let failures = 0;

for (const route of ROUTES) {
  const page = await browser.newPage();
  const problems = [];
  page.on("console", (msg) => {
    if (msg.type() === "error" || msg.type() === "warning") {
      problems.push(`[console.${msg.type()}] ${msg.text()}`);
    }
  });
  page.on("pageerror", (err) => {
    problems.push(`[pageerror] ${err.message}`);
  });
  page.on("requestfailed", (req) => {
    problems.push(`[requestfailed] ${req.url()} — ${req.failure()?.errorText}`);
  });

  await page.goto(BASE + route, { waitUntil: "networkidle" });
  await page.waitForTimeout(1800); // let the hero intro settle / lazy work run

  if (problems.length === 0) {
    console.log(`OK    ${route}`);
  } else {
    failures += problems.length;
    console.log(`ISSUES ${route}:`);
    for (const p of problems) console.log("   " + p);
  }
  await page.close();
}

// Interaction pass on home: palette open, search, theme toggle, sandbox.
{
  const page = await browser.newPage();
  const problems = [];
  page.on("console", (msg) => {
    if (msg.type() === "error" || msg.type() === "warning") problems.push(`[console.${msg.type()}] ${msg.text()}`);
  });
  page.on("pageerror", (err) => problems.push(`[pageerror] ${err.message}`));

  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.waitForTimeout(1600);

  // open palette with "/", type a query, check results render
  await page.keyboard.press("/");
  await page.waitForTimeout(300);
  await page.keyboard.type("poisoning");
  await page.waitForTimeout(300);
  const results = await page.locator("#palette-list li").count();
  console.log(results > 0 ? `OK    palette query "poisoning" -> ${results} rows` : "ISSUE palette returned 0 rows");
  await page.keyboard.press("Enter"); // navigate to first result
  await page.waitForTimeout(400);
  console.log(`      url after Enter: ${page.url()}`);

  // theme toggle x2 (system -> light -> dark)
  await page.getByRole("button", { name: /Color scheme/ }).click();
  await page.waitForTimeout(400);
  await page.getByRole("button", { name: /Color scheme/ }).click();
  await page.waitForTimeout(400);

  // lab: inject + defense
  await page.goto(BASE + "/lab", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Inject poisoned document (d8)" }).click();
  await page.waitForTimeout(400);
  const firstRank = await page.locator("ol[aria-label='Ranking, top 5'] li").first().textContent();
  console.log(firstRank?.includes("d8") ? "OK    inject -> d8 ranks first" : `ISSUE inject top rank: ${firstRank}`);
  await page.getByRole("button", { name: "Enable toy defense" }).click();
  await page.waitForTimeout(400);
  const ranksAfter = await page.locator("ol[aria-label='Ranking, top 5'] li").allTextContents();
  const top3 = ranksAfter.slice(0, 3).join(" | ");
  console.log(!top3.includes("d8") ? "OK    defense -> d8 out of top 3" : `ISSUE defended top3: ${top3}`);

  // context budget slider + move buttons
  await page.getByLabel("Move c3 up").click();
  await page.waitForTimeout(200);
  await page.locator("#budget-slider").fill("96");
  await page.waitForTimeout(200);
  const truncated = await page.locator("text=truncated").count();
  console.log(truncated > 0 ? "OK    context budget truncates under small budget" : "ISSUE no truncation at 96 tok");

  // mobile viewport pass
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.waitForTimeout(1600);
  const hscroll = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  console.log(hscroll <= 0 ? "OK    390px no horizontal scroll" : `ISSUE 390px horizontal overflow: ${hscroll}px`);
  await page.getByRole("button", { name: "Open index" }).click();
  await page.waitForTimeout(400);
  const menuVisible = await page.getByRole("dialog", { name: "Site index" }).isVisible();
  console.log(menuVisible ? "OK    mobile index opens" : "ISSUE mobile index did not open");
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);

  if (problems.length === 0) {
    console.log("OK    interaction pass: no console errors/warnings");
  } else {
    failures += problems.length;
    console.log("ISSUES during interactions:");
    for (const p of problems) console.log("   " + p);
  }
  await page.close();
}

await browser.close();
console.log(failures === 0 ? "\nAUDIT PASS" : `\nAUDIT FAIL (${failures} problems)`);
process.exitCode = failures === 0 ? 0 : 1;
