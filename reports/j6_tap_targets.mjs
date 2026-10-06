/** J6 mobile audit — part 2: 44px tap-target enumeration under coarse pointer. */
import { chromium } from "playwright";

const BASE = "http://localhost:4183";
const ROUTES = [
  "/", "/research", "/work", "/lab", "/lab/corruption-sandbox",
  "/notes", "/notes/n1", "/publications", "/about", "/connect",
];

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2,
});

// Probe: does pointer:coarse actually match in this emulated context?
const page = await ctx.newPage();
await page.goto(BASE + "/", { waitUntil: "networkidle" });
const probe = await page.evaluate(() => ({
  coarse: matchMedia("(pointer: coarse)").matches,
  hoverNone: matchMedia("(hover: none)").matches,
  anyCoarse: matchMedia("(any-pointer: coarse)").matches,
}));
console.log("POINTER PROBE:", JSON.stringify(probe));

const results = [];
for (const route of ROUTES) {
  await page.goto(BASE + route, { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  const targets = await page.evaluate(() => {
    const sel = 'a, button, [role="option"], summary, input, [role="radio"]';
    const out = [];
    document.querySelectorAll(sel).forEach((el) => {
      const b = el.getBoundingClientRect();
      if (b.width === 0 || b.height === 0) return;
      const style = getComputedStyle(el);
      if (style.visibility === "hidden" || style.display === "none") return;
      const label = (el.getAttribute("aria-label") || el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 42);
      out.push({
        tag: el.tagName.toLowerCase() + (el.getAttribute("role") ? `[${el.getAttribute("role")}]` : ""),
        label, w: Math.round(b.width), h: Math.round(b.height),
        cls: (typeof el.className === "string" ? el.className : "").slice(0, 50),
      });
    });
    return out;
  });
  const fails = targets.filter(t => t.w < 43 || t.h < 43);
  results.push({ route, count: targets.length, fails });
}
await ctx.close();
await browser.close();

for (const r of results) {
  console.log(`\n=== ${r.route} — ${r.count} targets, ${r.fails.length} below 44 ===`);
  r.fails.forEach(f => console.log(`  ${f.tag} w=${f.w} h=${f.h} "${f.label}" [${f.cls}]`));
}
