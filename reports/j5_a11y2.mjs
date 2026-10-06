// Judge 05 follow-up: empty-state live region, help overlay focus, skip-link depth,
// mobile trap escape anatomy. Run: node reports/j5_a11y2.mjs
import { createRequire } from "node:module";
const require = createRequire("D:/Codex/play/portfolio/_tools/shot/package.json");
const { chromium } = require("playwright");

const BASE = "http://localhost:4183";
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

// A. empty-state live region (type into the input properly)
await page.goto(BASE + "/", { waitUntil: "networkidle" });
await page.waitForTimeout(400);
await page.keyboard.press("/");
await page.waitForTimeout(150);
await page.keyboard.type("zzzzqqq");
await page.waitForTimeout(250);
console.log("A empty-state:",
  await page.evaluate(() => {
    const p = document.querySelector('#palette-list [aria-live="polite"]');
    return p ? p.textContent.trim().slice(0, 70) : "NOT FOUND";
  }));

// B. help overlay ("?") — does focus move in?
await page.keyboard.press("Escape");
await page.waitForTimeout(120);
await page.keyboard.press("?");
await page.waitForTimeout(200);
console.log("B help overlay:",
  await page.evaluate(() => {
    const dlg = document.querySelector('[role="dialog"][aria-label="Keyboard help"]');
    return {
      open: !!dlg,
      focusedInside: dlg ? dlg.contains(document.activeElement) : false,
      active: document.activeElement === document.body ? "BODY" : document.activeElement.tagName,
    };
  }));
// Tab once while help open — does focus enter the dialog or stay outside?
await page.keyboard.press("Tab");
console.log("B2 after Tab:",
  await page.evaluate(() => {
    const dlg = document.querySelector('[role="dialog"][aria-label="Keyboard help"]');
    return { inside: dlg ? dlg.contains(document.activeElement) : false, el: document.activeElement.tagName + "." + (document.activeElement.className || "").split(" ")[0] };
  }));
await page.keyboard.press("Escape");
await page.waitForTimeout(120);

// C. how far back is the skip link from initial focus (main)?
const shifts = [];
await page.evaluate(() => document.getElementById("main-content")?.focus());
for (let i = 0; i < 8; i++) {
  const info = await page.evaluate(() => {
    const a = document.activeElement;
    return (a.className || "").toString().includes("skip-link") ? "SKIP-LINK" : `${a.tagName}:${(a.getAttribute("aria-label") || a.textContent || "").trim().slice(0, 18)}`;
  });
  shifts.push(info);
  if (info === "SKIP-LINK") break;
  await page.keyboard.press("Shift+Tab");
}
console.log("C Shift+Tab stops from main to skip-link:", shifts, "(depth =", shifts.length + ")");

// D. mobile menu trap anatomy — what is the trap's 'last' node?
await page.setViewportSize({ width: 390, height: 844 });
await page.goto(BASE + "/", { waitUntil: "networkidle" });
await page.waitForTimeout(300);
await page.getByRole("button", { name: "Open site index" }).click();
await page.waitForTimeout(200);
console.log("D trap nodes:",
  await page.evaluate(() => {
    const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, summary, [tabindex]:not([tabindex="-1"])';
    const dlg = document.querySelector('[role="dialog"][aria-label="Site index"]');
    const nodes = [...dlg.querySelectorAll(FOCUSABLE)].filter((el) => el.offsetParent !== null);
    const tabbable = nodes.filter((el) => el.getAttribute("tabindex") !== "-1");
    const desc = (el) => `${el.tagName}${el.getAttribute("role") ? "[" + el.getAttribute("role") + "]" : ""}${el.getAttribute("tabindex") !== null ? "(t=" + el.getAttribute("tabindex") + ")" : ""}:${(el.getAttribute("aria-label") || el.textContent || "").trim().slice(0, 14)}`;
    return {
      trapListLen: nodes.length,
      realTabbableLen: tabbable.length,
      trapLast: desc(nodes[nodes.length - 1]),
      realLast: desc(tabbable[tabbable.length - 1]),
      tabIndexMinusOneInList: nodes.filter((n) => n.getAttribute("tabindex") === "-1").map(desc),
    };
  }));
await ctx.close();
await browser.close();
console.log("DONE");
