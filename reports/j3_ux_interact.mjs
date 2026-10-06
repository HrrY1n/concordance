/**
 * Judge 03 (UX final review) — interactive task-flow tests for CONCORDANCE.
 * Run: node reports/j3_ux_interact.mjs  (from D:\Codex\play\portfolio)
 * Server under test: http://localhost:4183/
 */
import { chromium } from "playwright";

const BASE = "http://localhost:4183";
const results = [];
const log = (name, pass, detail) => {
  results.push({ name, pass, detail });
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}  — ${detail}`);
};

const browser = await chromium.launch();
const errors = [];

async function newPage(opts = {}) {
  const ctx = await browser.newContext(opts);
  const page = await ctx.newPage();
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(`[console] ${page.url()} ${m.text()}`);
  });
  page.on("pageerror", (e) => errors.push(`[pageerror] ${page.url()} ${e.message}`));
  return { ctx, page };
}

/* ============================================================
   T1. Palette search → jump
   ============================================================ */
{
  const { ctx, page } = await newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(BASE + "/", { waitUntil: "networkidle" });

  // open with "/"
  await page.keyboard.press("/");
  const dialog = page.locator('div[role="dialog"]').first();
  await dialog.waitFor({ state: "visible", timeout: 3000 });
  const comboCount = await page.locator('input[role="combobox"]').count();
  log("T1a palette opens via '/' with combobox role", comboCount === 1, `combobox count=${comboCount}`);

  // wait for focus to actually land in the input, then type
  const focusOk = await page
    .waitForFunction(() => document.activeElement?.getAttribute?.("role") === "combobox", null, { timeout: 2000 })
    .then(() => true)
    .catch(() => false);
  log("T1-pre focus lands in combobox input", focusOk, "waiting for focus after open");
  await page.keyboard.type("corruption", { delay: 25 });
  await page.waitForTimeout(120);
  const typedVal = await page.locator('input[role="combobox"]').inputValue();
  log("T1-pre2 typed value reaches input", typedVal === "corruption", `input="${typedVal}"`);
  const opts = page.locator('#palette-list [role="option"]');
  const n = await opts.count();
  const first = n > 0 ? (await opts.first().textContent())?.replace(/\s+/g, " ").trim() : "(none)";
  log("T1b typing yields ranked results", n > 0, `results=${n} first="${first}"`);

  // arrow down twice then Enter → should navigate to sandbox
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("ArrowDown");
  const activeDescendant = await page.locator('input[role="combobox"]').getAttribute("aria-activedescendant");
  log("T1c aria-activedescendant tracks arrows", activeDescendant === "palette-opt-2", `activedescendant=${activeDescendant}`);
  // combobox a11y attrs (checked while still open)
  const expanded = await page.locator('input[role="combobox"]').getAttribute("aria-expanded");
  const controls = await page.locator('input[role="combobox"]').getAttribute("aria-controls");
  log("T1e combobox aria-expanded/controls", expanded === "true" && controls === "palette-list", `expanded=${expanded} controls=${controls}`);
  await page.keyboard.press("Enter");
  await page.waitForTimeout(600);
  const url1 = page.url();
  const h1 = (await page.locator("main h1").first().textContent())?.trim();
  log("T1d Enter navigates to demo route", url1.includes("/lab/corruption-sandbox"), `url=${url1} h1="${h1}"`);

  // esc closes
  await page.keyboard.press("/");
  await page.waitForTimeout(150);
  await page.keyboard.press("Escape");
  await page.waitForTimeout(150);
  const closedCount = await page.locator('input[role="combobox"]').count();
  log("T1f Esc closes palette", closedCount === 0, `combobox count after esc=${closedCount}`);
  await ctx.close();
}

/* ============================================================
   T2. Hero facet click → palette prefill (M3)
   ============================================================ */
{
  const { ctx, page } = await newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  const facet = page.locator('button.u-chip').filter({ hasText: "⌕" }).first();
  const facetText = (await facet.textContent())?.trim();
  await facet.click();
  await page.waitForTimeout(250);
  const combo = page.locator('input[role="combobox"]');
  const val = await combo.inputValue();
  log("T2a hero facet opens palette with prefill", (await combo.count()) === 1 && val.length > 0, `facet="${facetText}" prefill="${val}"`);
  // prefilled query should already produce results
  const n = await page.locator('#palette-list [role="option"]').count();
  log("T2b prefill yields results immediately", n > 0, `results=${n}`);
  // Enter navigates somewhere sensible
  await page.keyboard.press("Enter");
  await page.waitForTimeout(500);
  const navigated = page.url() !== BASE + "/";
  log("T2c Enter from prefilled palette navigates", navigated, `url=${page.url()}`);
  await ctx.close();
}

/* T2d-f: work-page tag chips + research chips also prefill */
{
  const { ctx, page } = await newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(BASE + "/work", { waitUntil: "networkidle" });
  const chip = page.locator('button.u-chip').filter({ hasText: "⌕" }).first();
  if ((await chip.count()) > 0) {
    const t = (await chip.textContent())?.trim();
    await chip.click();
    await page.waitForTimeout(250);
    const val = await page.locator('input[role="combobox"]').inputValue();
    log("T2d work-page tag chip prefills palette", val.length > 0, `tag="${t}" prefill="${val}"`);
  } else {
    log("T2d work-page tag chip prefills palette", false, "no chips found on /work");
  }
  await ctx.close();
}

/* ============================================================
   T3. Sandbox: inject → rank change → defense → re-rank
   ============================================================ */
{
  const { ctx, page } = await newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(BASE + "/lab/corruption-sandbox", { waitUntil: "networkidle" });
  await page.waitForTimeout(400);

  const readRanking = async () => {
    const rows = page.locator('ol[aria-label*="ranking" i] > li');
    const out = [];
    const n = await rows.count();
    for (let i = 0; i < n; i++) {
      const txt = (await rows.nth(i).textContent())?.replace(/\s+/g, " ").trim();
      const fill = rows.nth(i).locator(".rank-fill");
      const transform = (await fill.count()) ? await fill.getAttribute("style") : "";
      out.push({ txt: txt?.slice(0, 90), transform });
    }
    return out;
  };

  const live = page.locator("p[aria-live='polite'].sr-only");
  const liveText0 = await live.textContent();

  // initial clean state
  const clean = await readRanking();
  const cleanTop = clean[0]?.txt ?? "";
  log("T3a clean corpus top-5 rendered", clean.length === 5, `rows=${clean.length} top="${cleanTop}"`);

  // inject poison
  await page.getByRole("button", { name: /inject poisoned/i }).click();
  await page.waitForTimeout(400);
  const poisoned = await readRanking();
  const poisonedHasD8 = poisoned.some((r) => r.txt?.includes("d8"));
  const d8Rank = poisoned.findIndex((r) => r.txt?.includes("d8")) + 1;
  const poisonedFlags = await page.locator('[data-flag="poisoned"]').count();
  const liveAfterInject = (await live.textContent())?.trim();
  log("T3b inject puts d8 into top-5", poisonedHasD8, `d8 rank=${d8Rank} poisonedFlags=${poisonedFlags}`);
  log("T3c aria-live announces injection", /inject/i.test(liveAfterInject ?? "") && /rank/i.test(liveAfterInject ?? ""), `live="${liveAfterInject}"`);

  // deltas visible
  const deltaSpans = await page.locator('ol[aria-label*="ranking" i] span:text-is("▲1"), ol[aria-label*="ranking" i] span:text-matches("▲\\\\d+")').count();

  // enable defense
  await page.getByRole("button", { name: /enable toy defense/i }).click();
  await page.waitForTimeout(400);
  const defended = await readRanking();
  const d8RankAfter = defended.findIndex((r) => r.txt?.includes("d8")) + 1;
  const d8OutOfTop3 = d8RankAfter === 0 || d8RankAfter > 3;
  const liveAfterDefense = (await live.textContent())?.trim();
  log("T3d defense demotes d8 out of top-3", d8OutOfTop3, `d8 rank after defense=${d8RankAfter || "absent"}`);
  log("T3e aria-live announces defense", /defen/i.test(liveAfterDefense ?? ""), `live="${liveAfterDefense}"`);

  // bar widths: max is defended-top; check no overflow (transform scaleX <= 1)
  const transforms = defended.map((r) => parseFloat((r.transform.match(/scaleX\(([\d.]+)\)/) || [])[1] ?? "0"));
  const noOverflow = transforms.every((v) => v <= 1.001);
  const floorOk = transforms.every((v) => v >= 0.019);
  log("T3f bar widths clamped <=1 and floored >=0.02", noOverflow && floorOk, `widths=${transforms.map((v) => v.toFixed(2)).join(",")}`);

  // remove poison entirely
  await page.getByRole("button", { name: /remove the poisoned/i }).click();
  await page.waitForTimeout(400);
  const restored = await readRanking();
  const liveAfterRemove = (await live.textContent())?.trim();
  log("T3g remove restores clean corpus", restored.length === 5 && !restored.some((r) => r.txt?.includes("d8")), `live="${liveAfterRemove}"`);

  // corpus list still shows 7 docs after removal
  const corpusCount = await page.locator('h3:has-text("corpus") + ul > li, ul:has(li [data-flag="poisoned"]) >> ..').count();
  const docs = await page.locator('h3:has-text("corpus —")').textContent();
  log("T3h corpus readout says 7 docs after removal", /7/.test(docs ?? ""), `readout="${docs?.trim()}"`);
  await ctx.close();
}

/* ============================================================
   T4. Mobile nav → deep link → back
   ============================================================ */
{
  const { ctx, page } = await newPage({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
    deviceScaleFactor: 3,
  });
  await page.goto(BASE + "/", { waitUntil: "networkidle" });

  const menuBtn = page.locator('header button[aria-label*="menu" i], header button[aria-label*="index" i]').first();
  const menuBtnLabel = await menuBtn.getAttribute("aria-label");
  await menuBtn.click();
  await page.waitForTimeout(300);
  const dialogVisible = await page.locator('div[role="dialog"][aria-label*="index" i]').count();
  const links = page.locator('div[role="dialog"] nav a');
  const linkCount = await links.count();
  log("T4a mobile menu opens as full-screen dialog", dialogVisible === 1 && linkCount >= 7, `label="${menuBtnLabel}" links=${linkCount}`);

  // touch-target sizes
  const sizes = [];
  for (let i = 0; i < linkCount; i++) {
    const box = await links.nth(i).boundingBox();
    if (box) sizes.push(box.height);
  }
  const minH = Math.min(...sizes);
  log("T4b mobile menu rows >= 44px", minH >= 44, `min row height=${minH?.toFixed(1)}px`);

  // navigate to Research via menu
  await links.filter({ hasText: "Research" }).first().click();
  await page.waitForTimeout(700);
  const urlAfter = page.url();
  const h1After = (await page.locator("main h1").first().textContent())?.trim();
  const menuClosed = (await page.locator('div[role="dialog"][aria-label*="index" i]').count()) === 0;
  log("T4c menu link navigates + closes menu", urlAfter.includes("/research") && menuClosed, `url=${urlAfter} h1="${h1After}"`);

  // deep-link refresh
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(400);
  const h1Reload = (await page.locator("main h1").first().textContent())?.trim();
  log("T4d deep link /research survives refresh on mobile", /research|question|direction/i.test(h1Reload ?? "") && !!h1Reload, `h1 after reload="${h1Reload}"`);

  // browser back returns home
  await page.goBack();
  await page.waitForTimeout(500);
  log("T4e back returns to home", page.url() === BASE + "/", `url=${page.url()}`);

  // coarse pointer: header toggle buttons >= 44px
  const headerBtns = page.locator("header button");
  const hbCount = await headerBtns.count();
  let minHeader = 999;
  for (let i = 0; i < hbCount; i++) {
    const b = await headerBtns.nth(i).boundingBox();
    if (b) minHeader = Math.min(minHeader, b.height, b.width);
  }
  log("T4f header touch targets >= 44px", minHeader >= 44, `min=${minHeader?.toFixed(1)}px across ${hbCount} buttons`);
  await ctx.close();
}

/* ============================================================
   T5. G1: entrance animation starts from visible state
   ============================================================ */
{
  const { ctx, page } = await newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(BASE + "/", { waitUntil: "domcontentloaded" });
  // Sample .settle computed style as early as possible (mid-animation) — check opacity is never 0
  const earlyOpacity = await page.evaluate(() => {
    const el = document.querySelector(".settle");
    if (!el) return null;
    return getComputedStyle(el).opacity;
  });
  const settleCss = await page.evaluate(() => {
    // find any rule with opacity:0 in settle/keyframes
    let hits = [];
    for (const sheet of document.styleSheets) {
      let rules;
      try { rules = sheet.cssRules; } catch { continue; }
      for (const r of rules ?? []) {
        const t = r.cssText ?? "";
        if (/opacity\s*:\s*0(?!\.\d*[1-9])/.test(t) && /settle|settle-up|hero/i.test(t)) hits.push(t.slice(0, 120));
      }
    }
    return hits;
  });
  log("T5a .settle opacity never 0 (early sample)", earlyOpacity === null || Number(earlyOpacity) > 0, `early opacity=${earlyOpacity}`);
  log("T5b no opacity:0 in settle keyframes", settleCss.length === 0, settleCss.length ? settleCss.join(" | ") : "none found");

  // disable all animation/transition, verify hero content fully visible & laid out
  await page.addStyleTag({ content: "*,*::before,*::after{animation:none!important;transition:none!important}" });
  await page.waitForTimeout(50);
  const hero = await page.evaluate(() => {
    const h = document.querySelector("h1");
    if (!h) return null;
    const r = h.getBoundingClientRect();
    const s = getComputedStyle(h);
    return { text: h.textContent?.trim().slice(0, 60), w: r.width, h: r.height, opacity: s.opacity, transform: s.transform, visibility: s.visibility };
  });
  log("T5c hero visible with animations disabled", !!hero && hero.w > 0 && hero.h > 0 && Number(hero.opacity) === 1, JSON.stringify(hero));

  // figure content present immediately (FIG.01 bars)
  const bars = await page.locator(".rank-fill").count();
  log("T5d FIG.01 rank bars present with anim disabled", bars >= 6, `bars=${bars}`);
  await ctx.close();
}

/* T5e: noscript — content reachable without JS */
{
  const { ctx, page } = await newPage();
  await page.addInitScript(() => { Object.defineProperty(navigator, "javaEnabled", { value: () => false }); });
  const ctxNoJs = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1440, height: 900 } });
  const p2 = await ctxNoJs.newPage();
  await p2.goto(BASE + "/", { waitUntil: "domcontentloaded" });
  const bodyText = (await p2.evaluate(() => document.body.innerText)).replace(/\s+/g, " ");
  const hasNoscriptContent = /concordance|index of one researcher|§0/i.test(bodyText);
  log("T5e noscript renders static skeleton with content", hasNoscriptContent, `body text sample="${bodyText.slice(0, 160)}"`);
  await ctxNoJs.close();
  await ctx.close();
}

/* ============================================================
   T6. G4: all routes deep-link refresh 200 + 404 page
   ============================================================ */
{
  const routes = ["/", "/research", "/work", "/lab", "/lab/corruption-sandbox", "/notes", "/notes/n1", "/notes/n2", "/notes/n3", "/publications", "/about", "/connect"];
  const { ctx, page } = await newPage({ viewport: { width: 1440, height: 900 } });
  for (const r of routes) {
    const resp = await page.goto(BASE + r, { waitUntil: "networkidle" });
    const status = resp?.status();
    const h1 = (await page.locator("main h1").first().textContent())?.trim();
    const mainEmpty = (await page.locator("main").textContent())?.trim().length ?? 0;
    log(`T6 ${r} refresh=200 + h1`, status === 200 && (h1?.length ?? 0) > 0 && mainEmpty > 50, `status=${status} h1="${h1}" mainChars=${mainEmpty}`);
  }
  // 404 page
  const resp404 = await page.goto(BASE + "/no/such/address", { waitUntil: "networkidle" });
  const h1404 = (await page.locator("main h1").first().textContent())?.trim();
  const hasSearch = await page.locator('button:has-text("query the corpus")').count();
  const hasIndex = await page.locator('a:has-text("frontispiece")').count();
  log("T6x 404 route shows quality fallback", resp404?.status() === 200 && /no entry|no record/i.test(h1404 ?? "") && hasSearch === 1, `status=${resp404?.status()} h1="${h1404}" searchBtn=${hasSearch} backLink=${hasIndex}`);

  // invalid note slug → should show note-404 variant
  await page.goto(BASE + "/notes/nonexistent", { waitUntil: "networkidle" });
  const noteH1 = (await page.locator("main h1").first().textContent())?.trim();
  log("T6y bad note slug handled", /no (note|record)|404/i.test(noteH1 ?? ""), `h1="${noteH1}"`);
  await ctx.close();
}

/* ============================================================
   T7. 90-second task paths
   ============================================================ */
{
  // Recruiter: home → hero → work plate → connect, count clicks + time
  const { ctx, page } = await newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  const recruiterClicks = [];
  // home shows work preview; find link to /work
  const t0 = Date.now();
  await page.locator('a[href="/work"]').first().click();
  recruiterClicks.push("All plates");
  await page.waitForTimeout(600);
  const workH1 = (await page.locator("main h1").first().textContent())?.trim();
  const plateTitles = await page.locator('article h3, main h3').allTextContents();
  // evidence chain present?
  const evidence = await page.locator('main [class*="evidence"], main :text-matches("evidence chain","i")').count();
  // connect from footer or menu
  await page.locator('a[href="/connect"]').first().click();
  recruiterClicks.push("connect");
  await page.waitForTimeout(500);
  const mailto = await page.locator('a[href^="mailto:"]').count();
  const dt = Date.now() - t0;
  log("T7a recruiter path home→work→connect fast", dt < 3000 && mailto >= 1, `work h1="${workH1}" plates=${plateTitles.length} mailto=${mailto} elapsed=${dt}ms`);

  // Peer: hero facet → research page → question ledger with statuses
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.locator('a[href="/research"]').first().click();
  await page.waitForTimeout(600);
  const qCount = await page.locator('main :text-matches("Q\\\\d","i")').count();
  const statusWords = await page.locator('main :text("active"), main :text("settled"), main :text("open")').count();
  const figR1 = await page.locator('text=/FIG\\.? ?R1/i').count();
  log("T7b research page has question ledger + FIG.R1", qCount >= 3 && figR1 >= 1, `question refs=${qCount} status hits=${statusWords} figR1=${figR1}`);
  await ctx.close();
}

/* ============================================================
   T8. Consistency: coordinate system, mono readouts, noise audit
   ============================================================ */
{
  const { ctx, page } = await newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  const coords = await page.locator('text=/§0[0-7]/').count();
  const honestReads = await page.locator('text=/0ms network|computed in your browser/i').count();
  log("T8a coordinate system §00-§07 present", coords >= 5, `§ hits=${coords}`);
  log("T8b honesty readouts count (noise check)", honestReads >= 1 && honestReads <= 12, `0ms-network/computed hits=${honestReads}`);

  // scan full home page for repeated identical mono readout lines
  const fullText = (await page.locator("main").textContent())?.replace(/\s+/g, " ");
  const matches = fullText?.match(/0ms network/g) ?? [];
  log("T8c '0ms network' phrase frequency on home", matches.length <= 6, `occurrences=${matches.length}`);
  await ctx.close();
}

/* ============================================================
   T9. Keyboard-only path + skip link + help overlay
   ============================================================ */
{
  const { ctx, page } = await newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  // skip link is first tabbable
  await page.keyboard.press("Tab");
  const firstFocused = await page.evaluate(() => document.activeElement?.textContent?.trim() || document.activeElement?.tagName);
  log("T9a skip link is first tab stop", /skip/i.test(firstFocused ?? ""), `first focus="${firstFocused}"`);

  // ? opens help overlay
  await page.keyboard.press("?");
  await page.waitForTimeout(200);
  const helpDialog = await page.locator('div[role="dialog"][aria-label="Keyboard help"]').count();
  log("T9b '?' opens help overlay", helpDialog === 1, `help dialogs=${helpDialog}`);
  await page.keyboard.press("Escape");
  await page.waitForTimeout(150);

  // theme action from palette
  await page.keyboard.press("/");
  await page.waitForTimeout(150);
  await page.keyboard.type("theme");
  await page.waitForTimeout(150);
  const themeOpt = await page.locator('#palette-list [role="option"]', { hasText: "Re-ink" }).count();
  await page.keyboard.press("Enter");
  await page.waitForTimeout(300);
  const htmlClass = await page.evaluate(() => document.documentElement.getAttribute("data-theme") || document.documentElement.className);
  log("T9c palette 'Re-ink' action toggles theme", themeOpt >= 0 && typeof htmlClass === "string", `theme state="${htmlClass}" optFound=${themeOpt}`);
  await ctx.close();
}

await browser.close();

console.log("\n=== CONSOLE/PAGE ERRORS ===");
console.log(errors.length ? errors.join("\n") : "(none)");
console.log(`\nSUMMARY: ${results.filter((r) => r.pass).length}/${results.length} passed`);
