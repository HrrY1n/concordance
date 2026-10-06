// Judge 05 (Accessibility) — Round 3 live verification for CONCORDANCE (gen_03)
// Read-only: no generation_03 sources are touched. Run: node reports/j5_a11y.mjs
import { createRequire } from "node:module";
const require = createRequire("D:/Codex/play/portfolio/_tools/shot/package.json");
const { chromium } = require("playwright");

const BASE = "http://localhost:4183";
const out = [];
const log = (k, v) => { out.push({ k, v }); console.log(`\n== ${k} ==\n${typeof v === "string" ? v : JSON.stringify(v, null, 1)}`); };

function ratio(fg, bg) {
  const lum = (hex) => {
    const c = hex.replace("#", "");
    const [r, g, b] = [0, 2, 4].map((i) => parseInt(c.slice(i, i + 2), 16) / 255)
      .map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const l1 = lum(fg), l2 = lum(bg);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

const browser = await chromium.launch();
const consoleErrors = [];

async function newPage(opts = {}) {
  const ctx = await browser.newContext(opts.context || { viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  page.on("console", (m) => { if (m.type() === "error") consoleErrors.push(m.text().slice(0, 160)); });
  page.on("pageerror", (e) => consoleErrors.push("PAGEERROR " + String(e).slice(0, 160)));
  return { ctx, page };
}

/* ---------- 1. Initial focus + skip link (desktop, light) ---------- */
{
  const { ctx, page } = await newPage();
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  const initial = await page.evaluate(() => ({
    active: document.activeElement?.tagName + "#" + (document.activeElement?.id || ""),
    isMain: document.activeElement?.id === "main-content",
  }));
  log("1a initial focus on load", initial);

  // Tab forward from initial state: where does focus go?
  const tabStops = [];
  await page.keyboard.press("Tab");
  for (let i = 0; i < 6; i++) {
    const el = await page.evaluate(() => {
      const a = document.activeElement;
      return `${a.tagName} ${a.id ? "#" + a.id : ""} ${(a.textContent || a.getAttribute("aria-label") || "").trim().slice(0, 40)}`;
    });
    tabStops.push(el);
    await page.keyboard.press("Tab");
  }
  log("1b first Tab stops after load (is skip-link/header reachable forward?)", tabStops);

  // Shift+Tab from main should reach skip link (proves it is behind you)
  const back = await page.evaluate(() => { document.getElementById("main-content")?.focus(); return "focused-main"; });
  await page.keyboard.press("Shift+Tab");
  const afterShift = await page.evaluate(() => {
    const a = document.activeElement;
    return `${a.tagName}.${a.className.split(" ")[0]} "${(a.textContent || "").trim()}"`;
  });
  log("1c Shift+Tab from main reaches", { back, afterShift });

  // Skip link visible when focused + Enter works
  await page.evaluate(() => { const a = document.querySelector(".skip-link"); a?.focus(); });
  const skipVisible = await page.evaluate(() => {
    const a = document.querySelector(".skip-link");
    const r = a.getBoundingClientRect();
    const cs = getComputedStyle(a);
    return { inViewport: r.top >= 0 && r.left >= 0 && r.width > 0, transform: cs.transform };
  });
  await page.keyboard.press("Enter");
  await page.waitForTimeout(300);
  const skipTarget = await page.evaluate(() => document.activeElement?.id || document.activeElement?.tagName);
  log("1d skip link focus→visible, Enter→focus target", { skipVisible, skipTarget });
  await ctx.close();
}

/* ---------- 2. Palette combobox keyboard semantics ---------- */
{
  const { ctx, page } = await newPage();
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.waitForTimeout(400);
  await page.keyboard.press("/");
  await page.waitForTimeout(200);
  const comboState = await page.evaluate(() => {
    const input = document.querySelector('input[role="combobox"]');
    if (!input) return { present: false };
    return {
      present: true,
      focused: document.activeElement === input,
      expanded: input.getAttribute("aria-expanded"),
      controls: input.getAttribute("aria-controls"),
      activedescendant: input.getAttribute("aria-activedescendant"),
      listboxExists: !!document.getElementById("palette-list"),
      optionCount: document.querySelectorAll('#palette-list [role="option"]').length,
      dialog: document.querySelector('[role="dialog"]')?.getAttribute("aria-label"),
    };
  });
  log("2a palette open via '/'", comboState);

  await page.keyboard.type("rag");
  await page.waitForTimeout(150);
  const typed = await page.evaluate(() => ({
    results: document.querySelectorAll('#palette-list [role="option"]').length,
    active: document.querySelector('input[role="combobox"]')?.getAttribute("aria-activedescendant"),
    selected: [...document.querySelectorAll('#palette-list [role="option"]')].slice(0, 3).map(o => o.getAttribute("aria-selected")),
  }));
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("ArrowDown");
  const afterTwo = await page.evaluate(() => document.querySelector('input[role="combobox"]')?.getAttribute("aria-activedescendant"));
  await page.keyboard.press("ArrowUp");
  const afterUp = await page.evaluate(() => document.querySelector('input[role="combobox"]')?.getAttribute("aria-activedescendant"));
  log("2b typing + arrows update activedescendant", { typed, afterTwo, afterUp });

  // Enter executes
  await page.keyboard.press("Enter");
  await page.waitForTimeout(500);
  const afterEnter = await page.evaluate(() => ({
    url: location.pathname,
    paletteOpen: !!document.querySelector('input[role="combobox"]'),
    active: document.activeElement?.id || document.activeElement?.tagName,
  }));
  log("2c Enter navigates, focus lands on", afterEnter);

  // Esc close: where does focus go?
  await page.keyboard.press("/");
  await page.waitForTimeout(150);
  await page.keyboard.press("Escape");
  await page.waitForTimeout(150);
  const afterEsc = await page.evaluate(() => ({
    open: !!document.querySelector('input[role="combobox"]'),
    active: document.activeElement === document.body ? "BODY (focus lost)" : document.activeElement?.tagName + "#" + (document.activeElement?.id || ""),
  }));
  log("2d Esc closes palette, focus restoration", afterEsc);

  // Tab behavior inside palette: are option buttons tabbable (APG deviation)?
  await page.keyboard.press("/");
  await page.waitForTimeout(150);
  const tabSeq = [];
  for (let i = 0; i < 4; i++) {
    const el = await page.evaluate(() => {
      const a = document.activeElement;
      return `${a.tagName}${a.getAttribute("role") ? "[" + a.getAttribute("role") + "]" : ""} ${(a.textContent || "").trim().slice(0, 24)}`;
    });
    tabSeq.push(el);
    await page.keyboard.press("Tab");
  }
  log("2e Tab stops inside palette (options tabbable?)", tabSeq);

  // Empty results live region
  await page.keyboard.type("zzzzqqq");
  await page.waitForTimeout(200);
  const empty = await page.evaluate(() => {
    const live = document.querySelector('#palette-list [aria-live="polite"]');
    return { liveText: live?.textContent?.trim().slice(0, 60) || null };
  });
  log("2f empty-state live region", empty);

  // Placeholder contrast (computed)
  const ph = await page.evaluate(() => {
    const input = document.querySelector('input[role="combobox"]');
    const dialog = document.querySelector('[role="dialog"]');
    const c = getComputedStyle(input, "::placeholder").color;
    const bg = getComputedStyle(dialog).backgroundColor;
    const rgb = (s) => s.match(/\d+/g).map(Number);
    const hex = (a) => "#" + a.slice(0, 3).map((n) => n.toString(16).padStart(2, "0")).join("");
    return { placeholderColor: c, dialogBg: bg, placeholderHex: hex(rgb(c)), dialogBgHex: hex(rgb(bg)) };
  });
  const phRatio = ratio(ph.placeholderHex, ph.dialogBgHex);
  log("2g palette placeholder contrast (raised surface)", { ...ph, ratio: phRatio.toFixed(2) });
  await ctx.close();
}

/* ---------- 3. Duplicate anchor ids on /lab + accname impact ---------- */
{
  const { ctx, page } = await newPage();
  await page.goto(BASE + "/lab", { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  const ids = await page.evaluate(() => {
    const all = [...document.querySelectorAll("[id]")].map((e) => e.id);
    const dup = all.filter((id, i) => all.indexOf(id) !== i);
    const sec = document.querySelector('section[aria-labelledby="demo-corruption-sandbox"]');
    const h2 = document.getElementById("demo-corruption-sandbox")?.tagName;
    const firstMatch = document.getElementById("demo-corruption-sandbox")?.textContent?.slice(0, 60);
    const sectionSubtreeWords = sec?.textContent?.trim().split(/\s+/).length;
    return { duplicateIds: dup, firstMatchIs: h2, firstMatchText: firstMatch, sectionSubtreeWords };
  });
  log("3 duplicate ids on /lab (aria-labelledby impact)", ids);

  // heading structure across routes
  const routes = ["/", "/research", "/work", "/lab", "/lab/corruption-sandbox", "/notes", "/notes/n1", "/publications", "/about", "/connect", "/definitely-missing"];
  const heads = [];
  for (const r of routes) {
    await page.goto(BASE + r, { waitUntil: "networkidle" });
    await page.waitForTimeout(350);
    heads.push(await page.evaluate(() => ({
      route: location.pathname,
      h1: document.querySelectorAll("h1").length,
      h1text: document.querySelector("h1")?.textContent?.trim().slice(0, 30),
      landmarks: ["header", "nav", "main", "footer"].filter((t) => document.querySelector(t)).join("+"),
      lang: document.documentElement.lang,
      title: document.title.slice(0, 40),
      posTabindex: [...document.querySelectorAll("[tabindex]")].filter((e) => Number(e.getAttribute("tabindex")) > 0).length,
      unnamedButtons: [...document.querySelectorAll("button")].filter((b) => {
        const n = (b.getAttribute("aria-label") || b.textContent || "").trim();
        return n.length === 0;
      }).length,
      unnamedLinks: [...document.querySelectorAll("a")].filter((a) => (a.getAttribute("aria-label") || a.textContent || "").trim().length === 0).length,
    })));
  }
  log("3b per-route semantic audit", heads);
  await ctx.close();
}

/* ---------- 4. Sandbox aria-live + delta announcements ---------- */
{
  const { ctx, page } = await newPage();
  await page.goto(BASE + "/lab/corruption-sandbox", { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  const before = await page.evaluate(() => document.querySelector('p[aria-live="polite"].sr-only')?.textContent?.trim() || "");
  await page.getByRole("button", { name: /Inject poisoned document/ }).click();
  await page.waitForTimeout(300);
  const afterInject = await page.evaluate(() => ({
    live: document.querySelector('p[aria-live="polite"].sr-only')?.textContent?.trim(),
    pressed: [...document.querySelectorAll("button[aria-pressed]")].map((b) => b.getAttribute("aria-pressed")),
    poisonedFlag: !!document.querySelector('[data-flag="poisoned"]'),
  }));
  await page.getByRole("button", { name: /Enable toy defense/ }).click();
  await page.waitForTimeout(300);
  const afterDefense = await page.evaluate(() => ({
    live: document.querySelector('p[aria-live="polite"].sr-only')?.textContent?.trim(),
    deltas: [...document.querySelectorAll('span[aria-hidden="true"]')].map((s) => s.textContent?.trim()).filter((t) => /^[▲▼]/.test(t || "")).slice(0, 6),
  }));
  log("4 sandbox live announcements", { before, afterInject, afterDefense });
  await ctx.close();
}

/* ---------- 5. Mobile menu focus trap + touch targets ---------- */
{
  const { ctx, page } = await newPage({ context: { viewport: { width: 390, height: 844 }, hasTouch: true } });
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.waitForTimeout(400);
  await page.getByRole("button", { name: "Open site index" }).click();
  await page.waitForTimeout(250);
  const opened = await page.evaluate(() => ({
    dialog: !!document.querySelector('[role="dialog"][aria-modal="true"]'),
    focused: document.activeElement?.getAttribute("aria-label") || document.activeElement?.tagName,
    bodyScrollLocked: getComputedStyle(document.documentElement).overflow === "hidden",
  }));
  // Tab 12 times, record whether focus escapes the dialog
  let escaped = false;
  const seq = [];
  for (let i = 0; i < 12; i++) {
    await page.keyboard.press("Tab");
    const info = await page.evaluate(() => {
      const a = document.activeElement;
      const dlg = a.closest('[role="dialog"]');
      return { inDialog: !!dlg, label: (a.getAttribute("aria-label") || a.textContent || "").trim().slice(0, 20) };
    });
    if (!info.inDialog) { escaped = true; seq.push("ESCAPED→" + info.label); break; }
    seq.push(info.label);
  }
  await page.keyboard.press("Escape");
  await page.waitForTimeout(200);
  const afterEsc = await page.evaluate(() => ({
    open: !!document.querySelector('[role="dialog"]'),
    active: document.activeElement === document.body ? "BODY (focus lost)" : document.activeElement?.tagName,
  }));
  // touch target of mobile nav links
  const target = await page.evaluate(() => {
    document.querySelector('[aria-label="Open site index"]')?.click();
    return "reopened-for-measure";
  });
  await page.waitForTimeout(250);
  const sizes = await page.evaluate(() => {
    const link = document.querySelector('[role="dialog"] nav a');
    const radio = document.querySelector('[role="radio"]');
    return { navLink: link?.getBoundingClientRect().height, radio: radio?.getBoundingClientRect().height };
  });
  log("5 mobile menu", { opened, trapEscaped: escaped, stops: seq, afterEsc, touchTargets: sizes });
  await ctx.close();
}

/* ---------- 6. Route-change focus management + hash deep link ---------- */
{
  const { ctx, page } = await newPage();
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.waitForTimeout(400);
  await page.getByRole("navigation", { name: "Sections" }).getByRole("link", { name: /Research/ }).click();
  await page.waitForTimeout(500);
  const afterRoute = await page.evaluate(() => document.activeElement?.id || document.activeElement?.tagName);
  // hash deep link within research
  await page.goto(BASE + "/research#q1", { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  const afterHash = await page.evaluate(() => ({
    active: document.activeElement?.id || document.activeElement?.tagName,
    scrolledTo: Math.abs(window.scrollY) > 100 ? "yes (y=" + Math.round(window.scrollY) + ")" : "no y=" + Math.round(window.scrollY),
  }));
  // 404 route
  await page.goto(BASE + "/nope", { waitUntil: "networkidle" });
  await page.waitForTimeout(400);
  const nf = await page.evaluate(() => ({
    h1: document.querySelector("h1")?.textContent?.trim().slice(0, 40),
    focusedMain: document.activeElement?.id === "main-content",
  }));
  log("6 focus management", { afterRoute: afterRoute, afterHash, notFound: nf });
  await ctx.close();
}

/* ---------- 7. Contrast of flagged faint text (computed, both themes) ---------- */
for (const theme of ["light", "dark"]) {
  const { ctx, page } = await newPage({ context: { viewport: { width: 1440, height: 900 } } });
  await page.emulateMedia({ colorScheme: theme === "dark" ? "dark" : "light" });
  // force via storage-free: click theme? simpler: read token values from :root after setting class
  await page.goto(BASE + "/connect", { waitUntil: "networkidle" });
  await page.waitForTimeout(300);
  // ensure theme via localStorage then reload
  await page.evaluate((t) => { localStorage.setItem("concordance-theme", t); }, theme);
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(400);
  const conn = await page.evaluate(() => {
    const ghost = [...document.querySelectorAll("span.text-faint")].find((s) => s.textContent.includes("hidden until configured"));
    if (!ghost) return { found: false };
    const cs = getComputedStyle(ghost);
    const parentBg = (() => { let el = ghost; while (el && el !== document.documentElement) { const b = getComputedStyle(el).backgroundColor; if (b && !b.includes("0, 0, 0, 0") && b !== "transparent") return b; el = el.parentElement; } return getComputedStyle(document.body).backgroundColor; })();
    const hex = (a) => { const m = a.match(/\d+/g).map(Number); return "#" + m.slice(0, 3).map((n) => n.toString(16).padStart(2, "0")).join(""); };
    return { found: true, color: hex(cs.color), bg: hex(parentBg), ariaHidden: ghost.getAttribute("aria-hidden"), text: ghost.textContent.replace(/\s+/g, " ").trim().slice(0, 60) };
  });
  await page.goto(BASE + "/publications", { waitUntil: "networkidle" });
  await page.waitForTimeout(300);
  const pub = await page.evaluate(() => {
    const li = document.querySelector("li.text-faint");
    if (!li) return { found: false };
    const cs = getComputedStyle(li);
    const hex = (a) => { const m = a.match(/\d+/g).map(Number); return "#" + m.slice(0, 3).map((n) => n.toString(16).padStart(2, "0")).join(""); };
    const text = li.querySelector('[aria-hidden="true"]')?.nextElementSibling?.textContent || li.textContent;
    return { found: true, color: hex(cs.color), bg: "#f7f4ed", sample: text.replace(/\s+/g, " ").trim().slice(0, 60), ariaHiddenChild: li.querySelector('[aria-hidden="true"]') !== null };
  });
  const connRatio = conn.found ? ratio(conn.color, conn.bg) : null;
  const pubRatio = pub.found ? ratio(pub.color, "#f7f4ed") : null;
  log(`7 ${theme} flagged text-faint contrast`, {
    connect: conn.found ? { ...conn, ratio: connRatio.toFixed(2) } : conn,
    publications: pub.found ? { ...pub, ratio: pubRatio.toFixed(2) } : pub,
  });
  await ctx.close();
}

/* ---------- 8. prefers-contrast: more + reduced motion ---------- */
{
  const { ctx, page } = await newPage();
  await page.emulateMedia({ contrast: "more", reducedMotion: "reduce" });
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  const m = await page.evaluate(() => {
    const cs = getComputedStyle(document.documentElement);
    const settle = document.querySelector(".settle");
    const caret = document.querySelector('[data-live="true"] .caret');
    return {
      faintToken: cs.getPropertyValue("--faint").trim(),
      lineToken: cs.getPropertyValue("--line").trim(),
      settleAnim: settle ? getComputedStyle(settle).animationDuration : null,
      caretAnim: caret ? getComputedStyle(caret).animationDuration : null,
      smoothScroll: getComputedStyle(document.documentElement).scrollBehavior,
    };
  });
  const faintRatioMore = ratio(m.faintToken, "#f7f4ed");
  log("8 prefers-contrast:more + reduced-motion", { ...m, faintOnBgWithContrastMore: faintRatioMore.toFixed(2) });
  await ctx.close();
}

/* ---------- 9. noscript (JS disabled) ---------- */
{
  const { ctx, page } = await newPage({ context: { viewport: { width: 1440, height: 900 }, javaScriptEnabled: false } });
  await page.goto(BASE + "/", { waitUntil: "load" });
  await page.waitForTimeout(500);
  const ns = await page.evaluate(() => {
    const body = document.body.innerText;
    const el = document.querySelector("noscript");
    const txt = el ? el.textContent : "";
    return {
      noscriptPresent: !!el,
      visibleTextLength: body.trim().length,
      mentionsResearch: /§01 Research|Research/.test(txt || ""),
      mentionsConnect: /§0?7|Connect/.test(txt || ""),
      rootPopulated: document.getElementById("root")?.children.length || 0,
      excerpt: txt.replace(/\s+/g, " ").trim().slice(0, 400),
    };
  });
  log("9 noscript content", ns);
  await ctx.close();
}

/* ---------- 10. touch target / coarse pointer ---------- */
{
  const { ctx, page } = await newPage({ context: { viewport: { width: 390, height: 844 }, hasTouch: true } });
  await page.goto(BASE + "/lab", { waitUntil: "networkidle" });
  await page.waitForTimeout(400);
  const coarse = await page.evaluate(() => {
    const btns = [...document.querySelectorAll("button, a, summary")].slice(0, 40);
    const small = btns.map((b) => ({ t: b.tagName, h: Math.round(b.getBoundingClientRect().height), label: (b.getAttribute("aria-label") || b.textContent || "").trim().slice(0, 20) })).filter((x) => x.h > 0 && x.h < 44);
    return { below44: small };
  });
  log("10 coarse-pointer targets below 44px (lab)", coarse);
  await ctx.close();
}

console.log("\n== console errors ==", consoleErrors.length ? consoleErrors : "none");
await browser.close();
console.log("\nDONE");
