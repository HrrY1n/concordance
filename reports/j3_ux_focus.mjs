/** Focus deep-dive: skip-link tab order + hash deep-link cold vs warm. */
import { chromium } from "playwright";
const BASE = "http://localhost:4183";
const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();

await page.goto(BASE + "/", { waitUntil: "load" });
await page.waitForTimeout(800);

const diag = await page.evaluate(() => {
  const skip = document.querySelector(".skip-link");
  const root = document.getElementById("root");
  const skipPos = skip ? Array.from(document.querySelectorAll("*")).indexOf(skip) : -1;
  // can it be focused programmatically?
  skip?.focus();
  const focusedByJs = document.activeElement === skip;
  const vis = skip?.checkVisibility?.({ checkVisibilityCSS: true, checkOpacity: true, visibilityProperty: true });
  // where in DOM relative to header?
  const header = document.querySelector("header");
  const orderVsHeader = skip && header ? skip.compareDocumentPosition(header) : null; // 2=header after? Node.DOCUMENT_POSITION_FOLLOWING=4
  return {
    skipExists: !!skip,
    focusedByJs,
    checkVisibility: vis,
    skipPos,
    orderVsHeader: orderVsHeader === 4 ? "skip BEFORE header" : orderVsHeader === 2 ? "skip AFTER header" : String(orderVsHeader),
    rootChildCount: root?.children.length,
    bodyFirstNodes: Array.from(document.body.children).map((n) => n.tagName + "." + (n.id || n.className?.toString?.().slice(0, 20) || "")),
  };
});
console.log("D1 skip-link diagnostics:", JSON.stringify(diag, null, 1));

// now blur and Tab twice
await page.evaluate(() => document.activeElement?.blur?.());
await page.keyboard.press("Tab");
const t1 = await page.evaluate(() => `${document.activeElement?.tagName}:${document.activeElement?.textContent?.trim().slice(0, 20) || document.activeElement?.getAttribute("aria-label") || document.activeElement?.className?.slice(0, 30)}`);
console.log("D2 Tab#1 →", t1);
await page.keyboard.press("Tab");
const t2 = await page.evaluate(() => `${document.activeElement?.tagName}:${document.activeElement?.textContent?.trim().slice(0, 20) || document.activeElement?.getAttribute("aria-label") || document.activeElement?.className?.slice(0, 30)}`);
console.log("D2 Tab#2 →", t2);

// shift-tab from the RAG chip should land back on... whatever precedes it
const chip = page.locator("button.u-chip").first();
await chip.focus();
await page.keyboard.press("Shift+Tab");
const st = await page.evaluate(() => `${document.activeElement?.tagName}:${document.activeElement?.textContent?.trim().slice(0, 24) || document.activeElement?.getAttribute("aria-label") || document.activeElement?.className?.slice(0, 30)}`);
console.log("D3 Shift+Tab from first hero chip →", st);

/* Hash deep-link: cold vs warm */
await page.goto(BASE + "/research#q1", { waitUntil: "networkidle" });
await page.waitForTimeout(600);
const cold = await page.evaluate(() => {
  const el = document.getElementById("q1");
  return el ? { top: el.getBoundingClientRect().top, scrollY: window.scrollY } : { missing: true };
});
console.log("D4 COLD load /research#q1 →", JSON.stringify(cold));

// warm: navigate to /research first, then click an in-site hash link
await page.goto(BASE + "/research", { waitUntil: "networkidle" });
await page.waitForTimeout(400);
await page.goto(BASE + "/research#q3", { waitUntil: "networkidle" });
await page.waitForTimeout(400);
const warmHash = await page.evaluate(() => {
  const el = document.getElementById("q3");
  return el ? { top: el.getBoundingClientRect().top, scrollY: window.scrollY } : { missing: true };
});
console.log("D5 WARM goto #q3 (already-loaded page) →", JSON.stringify(warmHash));

// warm in-app: click a hash link from the sandbox page (client-side nav)
await page.goto(BASE + "/lab/corruption-sandbox", { waitUntil: "networkidle" });
await page.waitForTimeout(300);
const qLink = page.locator('a[href="/research#q1"], a[href="/research#q2"]').first();
if (await qLink.count()) {
  await qLink.click();
  await page.waitForTimeout(800);
  const appNav = await page.evaluate(() => {
    const el = document.getElementById(location.hash.slice(1));
    return el ? { hash: location.hash, top: el.getBoundingClientRect().top, scrollY: window.scrollY } : { hash: location.hash, missing: true };
  });
  console.log("D6 client-side nav to #q →", JSON.stringify(appNav));
} else {
  console.log("D6 no hash link found on sandbox (detailed=false maybe)");
}

// second cold load attempt with longer wait (does anything eventually scroll?)
await page.goto(BASE + "/research#q2", { waitUntil: "networkidle" });
await page.waitForTimeout(2500);
const late = await page.evaluate(() => {
  const el = document.getElementById("q2");
  return el ? { top: el.getBoundingClientRect().top, scrollY: window.scrollY } : { missing: true };
});
console.log("D7 COLD load #q2 after 2.5s →", JSON.stringify(late));

await browser.close();
