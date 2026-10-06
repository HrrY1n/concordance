/**
 * Judge 6 interaction re-verification at 390px.
 * Produces evidence screenshots in _crops with j6i_ prefix.
 */
import { chromium } from "playwright";
import fs from "node:fs";

const OUT = "D:/Codex/play/portfolio/reviews/round_02/_crops";
fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
const ctx = async () =>
  browser.newContext({
    viewport: { width: 390, height: 844 },
    colorScheme: "light",
    deviceScaleFactor: 1,
    hasTouch: true,
    isMobile: true,
  });
const log = [];

/* ---------- A: index overlay + sandbox inject ---------- */
{
  const p = await (await ctx()).newPage();
  await p.goto("http://localhost:4201/", { waitUntil: "networkidle" });
  await p.waitForTimeout(1200);
  // open Index overlay
  await p.getByRole("button", { name: /table of contents|index/i }).first().click();
  await p.waitForTimeout(500);
  await p.screenshot({ path: `${OUT}/j6i_a_index.png` });
  // tap a chapter link -> should navigate + close
  await p.getByRole("link", { name: /Lab/i }).first().click();
  await p.waitForTimeout(900);
  await p.screenshot({ path: `${OUT}/j6i_a_after_index_nav.png` });
  const headTxt = await p.evaluate(() => document.querySelector("header")?.innerText || "");
  log.push("A header after index nav: " + headTxt.replace(/\n/g, " | ").slice(0, 120));
  // sandbox inject
  const inject = p.getByRole("button", { name: /inject/i }).first();
  await inject.scrollIntoViewIfNeeded();
  await p.waitForTimeout(400);
  await inject.tap();
  await p.waitForTimeout(700);
  await p.screenshot({ path: `${OUT}/j6i_a_sandbox_injected.png` });
  // toy defense
  const def = p.getByRole("button", { name: /defense/i }).first();
  await def.tap();
  await p.waitForTimeout(700);
  await p.screenshot({ path: `${OUT}/j6i_a_sandbox_defense.png` });
  const rankTxt = await p.evaluate(() => {
    const el = document.querySelector('ol[aria-label="Top 5 ranked documents"]');
    return el ? el.innerText.slice(0, 200) : "n/a";
  });
  log.push("A ranking after inject+defense:\n" + rankTxt);
  await p.context().close();
}

/* ---------- D: scroll reveal + sidenote details ---------- */
{
  const p = await (await ctx()).newPage();
  await p.goto("http://localhost:4202/", { waitUntil: "networkidle" });
  await p.waitForTimeout(1200);
  // scroll progressively to trigger whileInView reveals, then measure opacity
  const revealProbe = await p.evaluate(async () => {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const h = document.body.scrollHeight;
    const results = [];
    for (let y = 0; y < h; y += 600) {
      window.scrollTo(0, y);
      await sleep(120);
    }
    await sleep(800);
    const secs = ["research", "work", "notes", "publications", "about"];
    for (const id of secs) {
      const el = document.getElementById(id);
      if (!el) continue;
      // check any Reveal div inside
      const inner = el.querySelector("div[style*='opacity']");
      const op = inner ? getComputedStyle(inner).opacity : "n/a";
      results.push(`${id}: reveal-opacity=${op}`);
    }
    return results;
  });
  log.push("D reveal after scroll: " + revealProbe.join("; "));
  // scroll to work section and screenshot (case records should be visible)
  await p.evaluate(() => document.getElementById("work")?.scrollIntoView());
  await p.waitForTimeout(900);
  await p.screenshot({ path: `${OUT}/j6i_d_work_scrolled.png` });
  // sidenote details fold on mobile
  const det = await p.evaluate(() => {
    const d = document.querySelectorAll("details.sn-fold");
    return d.length;
  });
  log.push(`D sn-fold details count @390: ${det}`);
  const sum = p.locator("details.sn-fold summary").first();
  if (det > 0) {
    await sum.scrollIntoViewIfNeeded();
    await p.waitForTimeout(300);
    await sum.tap();
    await p.waitForTimeout(400);
    await p.screenshot({ path: `${OUT}/j6i_d_sidenote_open.png` });
  }
  // contents overlay
  await p.evaluate(() => window.scrollTo(0, 0));
  await p.waitForTimeout(400);
  await p.getByRole("button", { name: /contents/i }).tap();
  await p.waitForTimeout(500);
  await p.screenshot({ path: `${OUT}/j6i_d_contents.png` });
  await p.context().close();
}

/* ---------- H: mobile menu + palette ---------- */
{
  const p = await (await ctx()).newPage();
  await p.goto("http://localhost:4203/", { waitUntil: "networkidle" });
  await p.waitForTimeout(1800); // let intro finish
  await p.screenshot({ path: `${OUT}/j6i_h_hero_resolved.png` });
  // open mobile menu
  await p.getByRole("button", { name: /open index/i }).tap();
  await p.waitForTimeout(500);
  await p.screenshot({ path: `${OUT}/j6i_h_menu.png` });
  // open palette from menu
  await p.getByRole("button", { name: "Search this site", exact: true }).tap();
  await p.waitForTimeout(600);
  await p.screenshot({ path: `${OUT}/j6i_h_palette.png` });
  // type query
  await p.keyboard.type("poisoning");
  await p.waitForTimeout(400);
  await p.screenshot({ path: `${OUT}/j6i_h_palette_query.png` });
  // tap first result
  const opt = p.getByRole("option").first();
  await opt.tap();
  await p.waitForTimeout(900);
  const url = p.url();
  log.push("H after palette result tap url: " + url);
  await p.screenshot({ path: `${OUT}/j6i_h_after_nav.png` });
  await p.context().close();
}

await browser.close();
fs.writeFileSync(OUT + "/j6i_log.txt", log.join("\n---\n"));
console.log(log.join("\n---\n"));
