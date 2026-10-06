import { chromium } from "playwright";
const BASE = "http://localhost:4183";
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
const page = await ctx.newPage();
await page.goto(BASE + "/", { waitUntil: "networkidle" });
await page.getByRole("button", { name: /press slash/ }).tap();
await page.waitForTimeout(400);
const seq = [];
for (let i = 0; i < 9; i++) {
  await page.keyboard.press("Tab");
  seq.push(await page.evaluate(() => {
    const dlg = document.querySelector('div[role="dialog"][aria-label="Query this site"], div[role="dialog"][aria-modal="true"]:not([aria-label="Site index"])');
    const a = document.activeElement;
    const inDlg = dlg ? dlg.contains(a) : false;
    return `${inDlg ? "IN " : "OUT"} ${(a?.tagName || "?")}:${(a?.getAttribute("aria-label") || a?.textContent || "").trim().slice(0, 22)}`;
  }));
}
console.log("PALETTE TRAP SEQ:\n  " + seq.join("\n  "));
await browser.close();
