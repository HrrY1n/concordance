/** J6 part 3b — fixed flows: menu nav, palette, sandbox, notes, safe-area. */
import { chromium } from "playwright";
import fs from "node:fs";

const BASE = "http://localhost:4183";
const OUT = "D:/Codex/play/portfolio/reviews/round_03/_j6_shots";
fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
const log = [];
const say = (m) => { log.push(m); console.log(m); };

/* ---------- A4-A6. Mobile menu: navigate, Esc, focus trap, link metrics ---------- */
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Open site index" }).tap();
  await page.waitForTimeout(350);

  const metrics = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('[aria-label="Site index"] nav a'));
    return links.map(a => {
      const cs = getComputedStyle(a);
      return { h: Math.round(a.getBoundingClientRect().height), minH: cs.minHeight, text: a.textContent.trim().slice(0, 20) };
    });
  });
  say(`A2b menu links (height + computed min-height): ${JSON.stringify(metrics)}`);

  // tap Research link scoped to dialog
  await page.locator('[aria-label="Site index"] nav a').first().tap();
  await page.waitForTimeout(700);
  const afterNav = await page.evaluate(() => ({
    url: location.pathname,
    menuGone: !document.querySelector('[aria-label="Site index"]'),
    htmlOverflow: document.documentElement.style.overflow,
    scrollY: window.scrollY,
    darkStillOn: document.documentElement.classList.contains("dark"),
  }));
  say(`A4 menu link tap -> ${JSON.stringify(afterNav)}`);

  await page.getByRole("button", { name: "Open site index" }).tap();
  await page.waitForTimeout(250);
  await page.keyboard.press("Escape");
  await page.waitForTimeout(250);
  const escState = await page.evaluate(() => ({
    menuGone: !document.querySelector('[aria-label="Site index"]'),
    htmlOverflow: document.documentElement.style.overflow,
  }));
  say(`A5 Esc closes: ${JSON.stringify(escState)}`);

  await page.getByRole("button", { name: "Open site index" }).tap();
  await page.waitForTimeout(250);
  for (let i = 0; i < 30; i++) await page.keyboard.press("Tab");
  const trap = await page.evaluate(() => {
    const dlg = document.querySelector('[aria-label="Site index"]');
    return { inside: dlg?.contains(document.activeElement) ?? false };
  });
  say(`A6 30x Tab inside dialog: ${JSON.stringify(trap)}`);

  // theme radio arrows
  await page.getByRole("radio", { name: "Dark" }).tap();
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(200);
  const themeAfterArrow = await page.evaluate(() => ({
    dark: document.documentElement.classList.contains("dark"),
    active: document.activeElement?.textContent,
  }));
  say(`A7 radio ArrowRight from Dark: ${JSON.stringify(themeAfterArrow)}`);
  await page.screenshot({ path: OUT + "/A_menu_open_dark.png" });
  await ctx.close();
}

/* ---------- B. Palette: chip prefill, keyboard-height viewport, option tap ---------- */
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto(BASE + "/", { waitUntil: "networkidle" });

  await page.locator("button.u-chip").first().tap();
  await page.waitForTimeout(400);
  const pal = await page.evaluate(() => {
    const input = document.querySelector('input[role="combobox"]');
    const ir = input?.getBoundingClientRect();
    return { open: !!input, q: input?.value, opts: document.querySelectorAll('[role="option"]').length, top: ir && Math.round(ir.top), h: ir && Math.round(ir.height), focused: document.activeElement === input };
  });
  say(`B1 chip -> palette prefilled: ${JSON.stringify(pal)}`);
  await page.screenshot({ path: OUT + "/B_palette_prefilled.png" });

  await page.locator('[role="option"]').first().tap();
  await page.waitForTimeout(700);
  say(`B2 option tap -> ${JSON.stringify(await page.evaluate(() => ({ url: location.pathname, closed: !document.querySelector('input[role="combobox"]') })))}`);

  // keyboard-height viewport: open palette from header with 300px height
  await page.setViewportSize({ width: 390, height: 300 });
  await page.getByRole("button", { name: /press slash/ }).tap();
  await page.waitForTimeout(500);
  const small = await page.evaluate(() => {
    const input = document.querySelector('input[role="combobox"]');
    const ir = input?.getBoundingClientRect();
    const scroller = document.querySelector("div.fixed.inset-0.z-50");
    return { vh: innerHeight, inputTop: ir && Math.round(ir.top), inputBottom: ir && Math.round(ir.bottom), listH: scroller ? scroller.scrollHeight : null };
  });
  say(`B3 palette @ keyboard-height 300px: ${JSON.stringify(small)}`);
  await page.screenshot({ path: OUT + "/B_palette_keyboard_viewport.png" });

  // can the user still reach/tap the first option in that squeezed state?
  const optTap = await page.evaluate(() => {
    const o = document.querySelector('[role="option"]');
    const r = o?.getBoundingClientRect();
    return r ? { top: Math.round(r.top), bottom: Math.round(r.bottom) } : null;
  });
  say(`B3b first option rect @300px: ${JSON.stringify(optTap)}`);
  await ctx.close();
}

/* ---------- C. Sandbox 390: inject / defense / bar rendering ---------- */
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto(BASE + "/lab/corruption-sandbox", { waitUntil: "networkidle" });

  await page.getByRole("button", { name: "Inject poisoned document (d8)" }).tap();
  await page.waitForTimeout(500);
  const s1 = await page.evaluate(() => ({
    bars: Array.from(document.querySelectorAll(".rank-fill")).map(el => el.style.transform).slice(0, 5),
    poisoned: !!document.querySelector('[data-flag="poisoned"]'),
    live: document.querySelector('p[aria-live="polite"]')?.textContent?.slice(0, 80),
  }));
  say(`C2 inject: ${JSON.stringify(s1)}`);

  await page.getByRole("button", { name: "Enable toy defense" }).tap();
  await page.waitForTimeout(500);
  const s2 = await page.evaluate(() => ({
    live: document.querySelector('p[aria-live="polite"]')?.textContent?.slice(0, 90),
    defenseNote: Array.from(document.querySelectorAll(".t-meta")).map(e => e.textContent).find(t => /×0\.1/.test(t || "")),
  }));
  say(`C3 defense: ${JSON.stringify(s2)}`);

  const geo = await page.evaluate(() => {
    const tracks = Array.from(document.querySelectorAll(".rank-track")).map(t => Math.round(t.getBoundingClientRect().width));
    const btns = Array.from(document.querySelectorAll(".u-btn")).map(b => Math.round(b.getBoundingClientRect().height));
    const barLabels = Array.from(document.querySelectorAll(".rank-track")).slice(0, 3).map(t => Math.round(t.parentElement.getBoundingClientRect().width));
    return { trackW: tracks, btnH: btns, rowW: barLabels };
  });
  say(`C4 geometry: ${JSON.stringify(geo)}`);
  await page.screenshot({ path: OUT + "/C_sandbox_390_ranking.png" });
  await page.locator(".u-btn").first().tap(); // remove poison
  await page.waitForTimeout(400);
  say(`C5 remove poison -> live: ${await page.evaluate(() => document.querySelector('p[aria-live="polite"]')?.textContent?.slice(0, 60))}`);
  await ctx.close();
}

/* ---------- D. Notes article fold ---------- */
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto(BASE + "/notes/n1", { waitUntil: "networkidle" });
  const d = await page.evaluate(() => ({
    folds: document.querySelectorAll("details.sn-fold").length,
    summaryH: Math.round(document.querySelector("details.sn-fold summary")?.getBoundingClientRect().height || 0),
    measure: (() => { const p = document.querySelector(".essay p"); return p ? Math.round(p.getBoundingClientRect().width) : null; })(),
  }));
  await page.locator("details.sn-fold summary").first().tap();
  await page.waitForTimeout(300);
  const open = await page.evaluate(() => document.querySelector("details.sn-fold")?.open);
  say(`D1 notes fold: ${JSON.stringify(d)} -> open after tap: ${open}`);
  await page.screenshot({ path: OUT + "/D_note_fold_open.png" });
  await ctx.close();
}

/* ---------- E. safe-area computed + 430px ---------- */
{
  const ctx = await browser.newContext({ viewport: { width: 430, height: 932 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto(BASE + "/connect", { waitUntil: "networkidle" });
  const safe = await page.evaluate(() => ({
    sw: document.documentElement.scrollWidth, vw: document.documentElement.clientWidth,
    headerPadTop: getComputedStyle(document.querySelector("header")).paddingTop,
    footerMarginBottom: getComputedStyle(document.querySelector("footer")).marginBottom,
    viewportFit: document.querySelector('meta[name="viewport"]')?.content,
  }));
  say(`E1 430px connect + safe-area (env=0 emulation): ${JSON.stringify(safe)}`);
  await ctx.close();
}

await browser.close();
fs.writeFileSync(OUT + "/log.txt", log.join("\n"));
console.log("\nDONE");
