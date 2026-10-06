/**
 * UX acceptance probes: viewport overflow, intro device lifecycle (first
 * visit / skip / Esc / return / reduced-motion), help layer, empty state,
 * CJK presence. Run: node scripts/audit-ux.mjs (preview server required).
 */
import { chromium } from "playwright";

const BASE = "http://localhost:4198";
const browser = await chromium.launch();
const page = await browser.newPage();
const problems = [];
page.on("console", (m) => {
  if (m.type() === "error" || m.type() === "warning") problems.push(m.text());
});
page.on("pageerror", (e) => problems.push(e.message));

// wide viewports overflow check
for (const w of [768, 1280, 1600]) {
  await page.setViewportSize({ width: w, height: 900 });
  await page.goto(BASE + "/work", { waitUntil: "networkidle" });
  const over = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  console.log(over <= 0 ? `OK    ${w}px no h-scroll` : `ISSUE ${w}px overflow ${over}px`);
}

// first visit: intro resolving then resolves; localStorage set
await page.setViewportSize({ width: 1280, height: 900 });
await page.evaluate(() => localStorage.clear());
await page.goto(BASE + "/", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(200);
const resolving = await page.locator("p[aria-live=polite]").first().textContent();
console.log(`first visit status: "${resolving?.trim()}"`);
await page.waitForTimeout(1700);
const resolved = await page.locator("p[aria-live=polite]").first().textContent();
console.log(resolved?.includes("resolved") ? "OK    intro self-completes" : `ISSUE after 1.7s: "${resolved}"`);
const stored = await page.evaluate(() => localStorage.getItem("h-intro-resolved"));
console.log(stored === "1" ? "OK    intro persisted" : "ISSUE intro not persisted");

// skip button visible at t=0 and gone after resolve
await page.evaluate(() => localStorage.clear());
await page.goto(BASE + "/", { waitUntil: "domcontentloaded" });
console.log(
  (await page.getByRole("button", { name: "skip intro →" }).isVisible())
    ? "OK    skip visible at t=0"
    : "ISSUE skip not visible",
);
await page.waitForTimeout(1600);
console.log(
  (await page.getByRole("button", { name: "skip intro →" }).isVisible().catch(() => false))
    ? "ISSUE skip still visible"
    : "OK    skip gone after resolve",
);

// Esc skip path
await page.evaluate(() => localStorage.clear());
await page.goto(BASE + "/", { waitUntil: "domcontentloaded" });
await page.getByRole("button", { name: "skip intro →" }).waitFor();
await page.keyboard.press("Escape");
await page.waitForTimeout(250);
const escStatus = await page.locator("p[aria-live=polite]").first().textContent();
console.log(escStatus?.includes("resolved") ? "OK    Esc skips intro" : `ISSUE Esc: "${escStatus}"`);

// return visit static
await page.goto(BASE + "/", { waitUntil: "domcontentloaded" });
const retStatus = await page.locator("p[aria-live=polite]").first().textContent();
console.log(
  retStatus?.includes("resolved") ? "OK    return visit static resolved" : `ISSUE return: "${retStatus}"`,
);

// reduced motion: static immediately, everything present
const ctx = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 1280, height: 900 } });
const p2 = await ctx.newPage();
p2.on("pageerror", (e) => problems.push("rm:" + e.message));
await p2.goto(BASE + "/", { waitUntil: "domcontentloaded" });
const rmStatus = await p2.locator("p[aria-live=polite]").first().textContent();
console.log(
  rmStatus?.includes("resolved") ? "OK    reduced-motion: static resolved" : `ISSUE rm: "${rmStatus}"`,
);

// help layer via "?"
await p2.keyboard.press("?");
await p2.waitForTimeout(300);
console.log(
  (await p2.getByRole("dialog", { name: "Keyboard help" }).isVisible())
    ? "OK    ? opens help"
    : "ISSUE help did not open",
);
await p2.keyboard.press("Escape");

// publications empty state
await p2.goto(BASE + "/publications", { waitUntil: "networkidle" });
const ghost = await p2.locator("text=pub-01").count();
const zero = await p2.locator("text=0 RECORDS").count();
console.log(
  ghost > 0 && zero > 0 ? "OK    publications empty state present" : "ISSUE empty state missing",
);

// CJK renders (about page contains the Chinese sentence)
await p2.goto(BASE + "/about", { waitUntil: "networkidle" });
const cjk = await p2.getByText("这是一个占位段落").count();
console.log(cjk > 0 ? "OK    CJK test sentence present" : "ISSUE CJK sentence missing");

console.log(problems.length === 0 ? "AUDIT2 PASS" : "AUDIT2 ISSUES:\n" + problems.join("\n"));
await browser.close();
