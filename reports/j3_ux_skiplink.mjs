/** Decisive skip-link experiment: fresh-load Tab behavior + backward reachability. */
import { chromium } from "playwright";
const BASE = "http://localhost:4183";
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

await page.goto(BASE + "/", { waitUntil: "networkidle" });
await page.waitForTimeout(500);

const snap = () =>
  page.evaluate(() => {
    const a = document.activeElement;
    return `${a?.tagName}:${(a?.textContent || a?.getAttribute("aria-label") || a?.id || "").trim().slice(0, 28)}`;
  });

console.log("S0 activeElement at load:", await snap());

// forward walk
const fwd = [];
for (let i = 0; i < 6; i++) {
  await page.keyboard.press("Tab");
  fwd.push(await snap());
}
console.log("S1 forward Tab x6:", JSON.stringify(fwd, null, 0));

// shift+tab walk back to the very start (cycle detection)
const back = [];
for (let i = 0; i < 30; i++) {
  await page.keyboard.press("Shift+Tab");
  const s = await snap();
  back.push(s);
  if (/skip/i.test(s) || (back.length > 2 && s === back[0])) break;
}
console.log("S2 shift+tab walk back:", JSON.stringify(back, null, 0));
console.log("S3 skip link reached backward:", back.some((s) => /skip/i.test(s)));

// from the skip link (if reached), forward-Tab: where does it go?
if (back.some((s) => /skip/i.test(s))) {
  await page.keyboard.press("Tab");
  console.log("S4 Tab forward from skip link →", await snap());
}

await browser.close();
