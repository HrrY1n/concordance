import { chromium } from "playwright";
const BASE = "http://localhost:4183";
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
const page = await ctx.newPage();
await page.goto(BASE + "/", { waitUntil: "networkidle" });
await page.getByRole("button", { name: "Open site index" }).tap();
await page.waitForTimeout(400);
const layout = await page.evaluate(() => {
  const dlg = document.querySelector('div[role="dialog"]');
  const kids = Array.from(dlg.children).map(k => {
    const r = k.getBoundingClientRect();
    return `${k.tagName}.${(k.className || "").toString().slice(0, 30)} top=${Math.round(r.top)} h=${Math.round(r.height)}`;
  });
  const close = document.querySelector('button[aria-label="Close site index"]').getBoundingClientRect();
  return { dlgRect: dlg.getBoundingClientRect().toJSON(), kids, closeTop: Math.round(close.top), padTop: getComputedStyle(dlg).paddingTop, active: document.activeElement?.getAttribute("aria-label") };
});
console.log(JSON.stringify(layout, null, 1));
await page.screenshot({ path: "D:/Codex/play/portfolio/reviews/round_03/_j6_shots/A_menu_clean.png" });
await browser.close();
