/** J6 mobile audit — part 3: interaction flows at 390/430 with touch. */
import { chromium } from "playwright";
import fs from "node:fs";

const BASE = "http://localhost:4183";
const OUT = "D:/Codex/play/portfolio/reviews/round_03/_j6_shots";
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const log = [];
const say = (m) => { log.push(m); console.log(m); };

/* ---------- A. Mobile menu: open, focus, escape, navigate, theme radio ---------- */
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto(BASE + "/", { waitUntil: "networkidle" });

  await page.getByRole("button", { name: "Open site index" }).tap();
  await page.waitForTimeout(300);
  const menuState = await page.evaluate(() => {
    const dlg = document.querySelector('[role="dialog"][aria-label="Site index"]');
    const active = document.activeElement;
    return {
      dialogPresent: !!dlg,
      focusLabel: active ? (active.getAttribute("aria-label") || active.textContent || "").slice(0, 30) : null,
      htmlOverflow: document.documentElement.style.overflow,
      links: dlg ? dlg.querySelectorAll("a").length : 0,
    };
  });
  say(`A1 menu open: ${JSON.stringify(menuState)}`);
  await page.screenshot({ path: OUT + "/A_menu_open.png" });

  // menu link heights
  const linkHeights = await page.evaluate(() =>
    Array.from(document.querySelectorAll('[aria-label="Site index"] nav a')).map(a => Math.round(a.getBoundingClientRect().height)));
  say(`A2 menu link heights: ${JSON.stringify(linkHeights)}`);

  // theme radio: tap Dark
  await page.getByRole("radio", { name: "Dark" }).tap();
  await page.waitForTimeout(300);
  const isDark = await page.evaluate(() => document.documentElement.classList.contains("dark"));
  say(`A3 tap Dark radio -> dark class: ${isDark}`);
  await page.screenshot({ path: OUT + "/A_menu_dark.png" });

  // tap a section link
  await page.getByRole("link", { name: /Research/ }).first().tap();
  await page.waitForTimeout(600);
  const afterNav = await page.evaluate(() => ({
    url: location.pathname,
    menuGone: !document.querySelector('[aria-label="Site index"]'),
    htmlOverflow: document.documentElement.style.overflow,
    scrollY: window.scrollY,
  }));
  say(`A4 menu link tap -> ${JSON.stringify(afterNav)}`);

  // reopen + Escape close, focus return check
  await page.getByRole("button", { name: "Open site index" }).tap();
  await page.waitForTimeout(250);
  await page.keyboard.press("Escape");
  await page.waitForTimeout(250);
  const escState = await page.evaluate(() => ({
    menuGone: !document.querySelector('[aria-label="Site index"]'),
    htmlOverflow: document.documentElement.style.overflow,
    focusOn: (document.activeElement?.getAttribute("aria-label") || "").slice(0, 30),
  }));
  say(`A5 Esc closes menu: ${JSON.stringify(escState)}`);

  // focus trap: Tab cycling inside menu
  await page.getByRole("button", { name: "Open site index" }).tap();
  await page.waitForTimeout(250);
  for (let i = 0; i < 30; i++) await page.keyboard.press("Tab");
  const trapState = await page.evaluate(() => {
    const dlg = document.querySelector('[aria-label="Site index"]');
    return { insideDialog: dlg?.contains(document.activeElement), focusTag: document.activeElement?.tagName };
  });
  say(`A6 30x Tab stays in dialog: ${JSON.stringify(trapState)}`);
  await ctx.close();
}

/* ---------- B. Palette on mobile: header open, chip prefill, keyboard-viewport ---------- */
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto(BASE + "/", { waitUntil: "networkidle" });

  // hero chip opens palette prefilled
  await page.getByRole("button", { name: /Ranking/ }).first().tap();
  await page.waitForTimeout(400);
  const pal = await page.evaluate(() => {
    const input = document.querySelector('input[role="combobox"]');
    const opts = document.querySelectorAll('[role="option"]');
    const ir = input?.getBoundingClientRect();
    return {
      open: !!input, query: input?.value, options: opts.length,
      inputTop: ir ? Math.round(ir.top) : null, inputH: ir ? Math.round(ir.height) : null,
      focused: document.activeElement === input,
    };
  });
  say(`B1 chip -> palette: ${JSON.stringify(pal)}`);
  await page.screenshot({ path: OUT + "/B_palette_prefilled.png" });

  // tap an option -> navigate
  await page.locator('[role="option"]').first().tap();
  await page.waitForTimeout(600);
  const nav = await page.evaluate(() => ({ url: location.pathname, closed: !document.querySelector('input[role="combobox"]') }));
  say(`B2 option tap -> ${JSON.stringify(nav)}`);

  // KEYBOARD SCENARIO: shrink viewport height like a software keyboard (390x300)
  await page.setViewportSize({ width: 390, height: 300 });
  await page.getByRole("button", { name: /search/i }).first().tap();
  await page.waitForTimeout(400);
  const small = await page.evaluate(() => {
    const input = document.querySelector('input[role="combobox"]');
    const ir = input?.getBoundingClientRect();
    const holder = input?.closest("div.mt-\\[8vh\\]") || input?.parentElement?.parentElement;
    return {
      inputVisibleTop: ir ? Math.round(ir.top) : null,
      inputBottom: ir ? Math.round(ir.bottom) : null,
      vh: innerHeight,
      scrollable: (() => { const el = document.querySelector("div.fixed.inset-0"); return el ? { sh: el.scrollHeight, ch: el.clientHeight } : null; })(),
    };
  });
  say(`B3 palette with keyboard-height viewport: ${JSON.stringify(small)}`);
  await page.screenshot({ path: OUT + "/B_palette_keyboard_viewport.png" });

  // backdrop tap closes
  await page.setViewportSize({ width: 390, height: 844 });
  await page.mouse.click(10, 500);
  await page.waitForTimeout(300);
  say(`B4 backdrop tap closes: ${await page.evaluate(() => !document.querySelector('input[role="combobox"]'))}`);
  await ctx.close();
}

/* ---------- C. Sandbox at 390: inject -> defense -> rank bars ---------- */
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto(BASE + "/lab/corruption-sandbox", { waitUntil: "networkidle" });

  const rankBefore = await page.evaluate(() => {
    const rows = document.querySelectorAll('ol[aria-label*="ranking"] li, ol li');
    return { rowCount: rows.length };
  });
  say(`C1 rank rows before: ${JSON.stringify(rankBefore)}`);

  await page.getByRole("button", { name: "Inject poisoned document (d8)" }).tap();
  await page.waitForTimeout(500);
  const afterInject = await page.evaluate(() => {
    const bars = Array.from(document.querySelectorAll(".rank-fill")).map(el => el.style.transform);
    const live = document.querySelector('p[aria-live="polite"]')?.textContent;
    const poisoned = document.querySelector('[data-flag="poisoned"]')?.textContent;
    return { bars: bars.slice(0, 5), live, poisoned };
  });
  say(`C2 after inject: ${JSON.stringify(afterInject)}`);
  await page.screenshot({ path: OUT + "/C_sandbox_injected.png", fullPage: true });

  await page.getByRole("button", { name: "Enable toy defense" }).tap();
  await page.waitForTimeout(500);
  const afterDefense = await page.evaluate(() => {
    const live = document.querySelector('p[aria-live="polite"]')?.textContent;
    const meta = Array.from(document.querySelectorAll(".t-meta")).map(e => e.textContent).find(t => t.includes("rank"));
    return { live };
  });
  say(`C3 after defense: ${JSON.stringify(afterDefense)}`);
  await page.screenshot({ path: OUT + "/C_sandbox_defended.png", fullPage: true });

  // bar geometry at 390
  const geo = await page.evaluate(() => {
    const track = document.querySelector(".rank-track")?.getBoundingClientRect();
    const btns = Array.from(document.querySelectorAll(".u-btn")).map(b => Math.round(b.getBoundingClientRect().height));
    return { trackW: track ? Math.round(track.width) : null, btnHeights: btns };
  });
  say(`C4 rank track width + control heights: ${JSON.stringify(geo)}`);
  await ctx.close();
}

/* ---------- D. Notes article: margin note fold, reading measure ---------- */
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto(BASE + "/notes/n1", { waitUntil: "networkidle" });
  const before = await page.evaluate(() => ({
    folds: document.querySelectorAll("details.sn-fold").length,
    summaryH: Math.round(document.querySelector("details.sn-fold summary")?.getBoundingClientRect().height || 0),
    open: document.querySelector("details.sn-fold")?.open,
    measure: (() => { const p = document.querySelector(".essay p"); return p ? Math.round(p.getBoundingClientRect().width) : null; })(),
  }));
  say(`D1 notes n1: ${JSON.stringify(before)}`);
  await page.locator("details.sn-fold summary").first().tap();
  await page.waitForTimeout(300);
  const after = await page.evaluate(() => ({ open: document.querySelector("details.sn-fold")?.open }));
  say(`D2 fold tap -> ${JSON.stringify(after)}`);
  await page.screenshot({ path: OUT + "/D_note_fold_open.png" });
  await ctx.close();
}

/* ---------- E. 430px spot check + header safe-area computed style ---------- */
{
  const ctx = await browser.newContext({ viewport: { width: 430, height: 932 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  const w = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, vw: document.documentElement.clientWidth }));
  say(`E1 430px / scrollW=${w.sw} vw=${w.vw}`);
  // safe-area: env() resolves to 0 in emulation but padding should still be 24px via max()
  const safe = await page.evaluate(() => {
    const header = document.querySelector("header");
    const wrap = document.querySelector(".wrap");
    return {
      headerPadTop: getComputedStyle(header).paddingTop,
      wrapPadLeft: getComputedStyle(wrap).paddingLeft,
      viewportFit: document.querySelector('meta[name="viewport"]')?.content,
    };
  });
  say(`E2 safe-area computed (no-notch env=0): ${JSON.stringify(safe)}`);
  await ctx.close();
}

await browser.close();
fs.writeFileSync(OUT + "/log.txt", log.join("\n"));
console.log("\nDONE");
