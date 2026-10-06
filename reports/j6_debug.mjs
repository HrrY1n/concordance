/** J6 part 4 — focus trap debug, min-h-[60px] check, 768px footer measurement. */
import { chromium } from "playwright";

const BASE = "http://localhost:4183";
const browser = await chromium.launch();

/* 1. Focus trap step-by-step */
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Open site index" }).tap();
  await page.waitForTimeout(300);
  const seq = [];
  for (let i = 0; i < 14; i++) {
    await page.keyboard.press("Tab");
    seq.push(await page.evaluate(() => {
      const a = document.activeElement;
      const dlg = document.querySelector('[aria-label="Site index"]');
      return `${dlg?.contains(a) ? "IN " : "OUT"} ${a?.tagName}:${(a?.getAttribute("aria-label") || a?.textContent || "").trim().slice(0, 18)} op=${a?.offsetParent !== null}`;
    }));
  }
  console.log("TRAP SEQUENCE:\n  " + seq.join("\n  "));
  await ctx.close();
}

/* 2. min-h-[60px] in compiled CSS? */
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  const css = await page.evaluate(async () => {
    const link = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))[0]?.href;
    const txt = await fetch(link).then(r => r.text());
    return {
      hasMinH60: txt.includes("min-h-\\[60px\\]") || txt.includes("min-h-[60px]"),
      hasMinH44: txt.includes("min-h-\\[44px\\]") || txt.includes("min-h-[44px]"),
      minH60Idx: txt.indexOf("60px"),
      sample: txt.slice(Math.max(0, txt.indexOf(".min-h") - 40), txt.indexOf(".min-h") + 120),
    };
  });
  console.log("\nCOMPILED CSS:", JSON.stringify(css, null, 1).slice(0, 600));
  await ctx.close();
}

/* 3. 768px footer measurement + other tablet grid checks */
{
  const ctx = await browser.newContext({ viewport: { width: 768, height: 1024 } });
  const page = await ctx.newPage();
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.waitForTimeout(400);
  const foot = await page.evaluate(() => {
    const grid = document.querySelector("footer .grid");
    const cols = getComputedStyle(grid).gridTemplateColumns;
    const left = grid.children[0].getBoundingClientRect();
    const tagline = grid.querySelector("p.t-small");
    const nav = grid.children[1].getBoundingClientRect();
    return {
      cols, leftW: Math.round(left.width), navW: Math.round(nav.width),
      taglineW: Math.round(tagline.getBoundingClientRect().width),
      taglineH: Math.round(tagline.getBoundingClientRect().height),
    };
  });
  console.log("\n768 FOOTER:", JSON.stringify(foot));

  // any other narrow-column text at 768? scan for text containers squeezed under 120px with >40 chars of text
  await page.goto(BASE + "/work", { waitUntil: "networkidle" });
  const narrow = await page.evaluate(() => {
    const out = [];
    document.querySelectorAll("p, dd, dt, span, a").forEach(el => {
      if (el.children.length > 0) return;
      const t = (el.textContent || "").trim();
      if (t.length < 30) return;
      const r = el.getBoundingClientRect();
      if (r.width > 0 && r.width < 130) out.push(`${el.tagName}:${t.slice(0, 30)}… w=${Math.round(r.width)}`);
    });
    return out.slice(0, 10);
  });
  console.log("768 /work narrow text:", JSON.stringify(narrow));
  await page.goto(BASE + "/research", { waitUntil: "networkidle" });
  const narrowR = await page.evaluate(() => {
    const out = [];
    document.querySelectorAll("p, dd, dt, span, a, h2, h3").forEach(el => {
      if (el.children.length > 0) return;
      const t = (el.textContent || "").trim();
      if (t.length < 30) return;
      const r = el.getBoundingClientRect();
      if (r.width > 0 && r.width < 130) out.push(`${el.tagName}:${t.slice(0, 30)}… w=${Math.round(r.width)}`);
    });
    return out.slice(0, 10);
  });
  console.log("768 /research narrow text:", JSON.stringify(narrowR));
  await ctx.close();
}

await browser.close();
console.log("\nDONE");
