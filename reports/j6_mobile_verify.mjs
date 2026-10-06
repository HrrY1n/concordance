/**
 * Judge 6 (Mobile UX) interactive verification, Round 2.
 * Usage: node reports/j6_mobile_verify.mjs
 */
import { chromium } from "playwright";
import fs from "node:fs";

const OUT = "D:/Codex/play/portfolio/reviews/round_02/_crops";
fs.mkdirSync(OUT, { recursive: true });

const teams = [
  { key: "A", base: "http://localhost:4201/" },
  { key: "D", base: "http://localhost:4202/" },
  { key: "H", base: "http://localhost:4203/" },
];

const report = {};
const browser = await chromium.launch();

for (const { key, base } of teams) {
  report[key] = {};
  for (const width of [390, 430]) {
    const context = await browser.newContext({
      viewport: { width, height: 844 },
      colorScheme: "light",
      deviceScaleFactor: 1,
      hasTouch: true,
      isMobile: true,
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(String(e).slice(0, 120)));
    page.on("console", (m) => {
      if (m.type() === "error") errors.push(m.text().slice(0, 120));
    });
    try {
      await page.goto(base, { waitUntil: "networkidle", timeout: 30000 });
    } catch {
      await page.waitForTimeout(2000);
    }
    await page.waitForTimeout(1800);

    // 1) horizontal overflow check
    const overflow = await page.evaluate(() => {
      const se = document.scrollingElement;
      const doc = document.documentElement;
      return {
        scrollWidth: se.scrollWidth,
        clientWidth: se.clientWidth,
        overflowPx: se.scrollWidth - se.clientWidth,
        bodyOverflow: doc.scrollWidth - window.innerWidth,
      };
    });

    // 2) tap-target audit (interactive elements only, visible)
    const tap = await page.evaluate(() => {
      const sel = 'a[href], button, input, select, textarea, summary, [role="button"], [role="radio"]';
      const els = Array.from(document.querySelectorAll(sel));
      const small = [];
      const seen = new Set();
      for (const el of els) {
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;
        if (r.bottom < 0 || r.top > window.innerHeight * 40) continue; // whole page
        const style = getComputedStyle(el);
        if (style.visibility === "hidden" || style.display === "none") continue;
        // expand by padding box only (no pseudo-element measurement here)
        const key = el.tagName + "|" + (el.textContent || "").trim().slice(0, 40) + "|" + Math.round(r.top);
        if (seen.has(key)) continue;
        seen.add(key);
        if (r.height < 44 || r.width < 44) {
          small.push({
            tag: el.tagName.toLowerCase(),
            text: (el.textContent || el.getAttribute("aria-label") || "").trim().slice(0, 40),
            w: Math.round(r.width),
            h: Math.round(r.height),
            cls: String(el.className).slice(0, 60),
          });
        }
      }
      return small;
    });
    report[key][width] = { overflow, smallTapTargets: tap, pageErrors: errors.slice(0, 5) };
    await context.close();
  }
}
await browser.close();
fs.writeFileSync(OUT + "/j6_tap_audit.json", JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2).slice(0, 6000));
