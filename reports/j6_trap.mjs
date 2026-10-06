/** J6 part 5 — precise focus-trap instrumentation inside MobileMenu. */
import { chromium } from "playwright";

const BASE = "http://localhost:4183";
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
const page = await ctx.newPage();

await page.goto(BASE + "/research", { waitUntil: "networkidle" });
await page.getByRole("button", { name: "Open site index" }).tap();
await page.waitForTimeout(350);

// Instrument: enumerate what trapTab would compute, at the moment focus is on the last node
const diag = await page.evaluate(() => {
  const dlg = document.querySelector('div[role="dialog"][aria-label="Site index"]');
  if (!dlg) return { err: "no dialog" };
  const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, summary, [tabindex]:not([tabindex="-1"])';
  const nodes = Array.from(dlg.querySelectorAll(FOCUSABLE)).filter(el => el.offsetParent !== null || el === document.activeElement);
  return {
    dlgFound: !!dlg,
    dlgIsFixed: getComputedStyle(dlg).position,
    nodeCount: nodes.length,
    nodes: nodes.map(n => `${n.tagName}:${(n.textContent || "").trim().slice(0, 14)}`),
    lastIsOffsetParentNull: nodes.length ? nodes[nodes.length - 1].offsetParent === null : null,
    firstIs: nodes[0]?.textContent?.trim().slice(0, 14),
    lastIs: nodes[nodes.length - 1]?.textContent?.trim().slice(0, 14),
    activeNow: (document.activeElement?.textContent || "").trim().slice(0, 14),
  };
});
console.log("DIAG:", JSON.stringify(diag, null, 1));

// Tab until we reach the last node, then one more Tab and see what happens
const seq = [];
for (let i = 0; i < 14; i++) {
  await page.keyboard.press("Tab");
  seq.push(await page.evaluate(() => {
    const a = document.activeElement;
    const dlg = document.querySelector('div[role="dialog"][aria-label="Site index"]');
    const inDlg = dlg ? dlg.contains(a) : false;
    return `${inDlg ? "IN " : "OUT"} ${(a?.tagName || "?")}:${(a?.getAttribute("aria-label") || a?.textContent || body()).trim().slice(0, 20)}`;
    function body() { return document.body ? document.body.textContent.slice(0, 14) : "?"; }
  }));
}
console.log("TRAP SEQ (on /research, dialog-scoped):\n  " + seq.join("\n  "));

await browser.close();
console.log("DONE");
