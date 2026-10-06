/**
 * Judge 6 extra mobile probes: D/H sandbox function + theme toggles at 390px.
 * Usage: node reports/j6_mobile_extra.mjs
 */
import { chromium } from "playwright";
import fs from "node:fs";

const OUT = "D:/Codex/play/portfolio/reviews/round_02/_crops";
fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
const ctx = () =>
  browser.newContext({
    viewport: { width: 390, height: 844 },
    colorScheme: "light",
    deviceScaleFactor: 1,
    hasTouch: true,
    isMobile: true,
  });
const log = [];
const shot = async (p, name) => p.screenshot({ path: `${OUT}/${name}.png` });

/* ---------- D sandbox ---------- */
{
  const p = await (await ctx()).newPage();
  await p.goto("http://localhost:4202/lab/corruption-sandbox", { waitUntil: "networkidle" });
  await p.waitForTimeout(1000);
  const inj = p.getByRole("button", { name: /inject/i }).first();
  await inj.scrollIntoViewIfNeeded();
  await inj.tap();
  await p.waitForTimeout(600);
  await shot(p, "j6x_d_sandbox_injected");
  const defBtn = p.getByRole("button", { name: /defense/i }).first();
  await defBtn.tap();
  await p.waitForTimeout(600);
  await shot(p, "j6x_d_sandbox_defense");
  const rankTxt = await p.evaluate(() => document.body.innerText.match(/RANKING[\s\S]{0,700}/)?.[0] || "n/a");
  log.push("D sandbox ranking region after inject+defense:\n" + rankTxt.slice(0, 700));
  // theme toggle cycle
  const theme = p.getByRole("button", { name: /theme/i }).first();
  await p.evaluate(() => window.scrollTo(0, 0));
  await p.waitForTimeout(300);
  await theme.tap();
  await p.waitForTimeout(400);
  const htmlAttr = await p.evaluate(() => document.documentElement.getAttribute("data-theme") || document.documentElement.className);
  log.push("D theme after 1 tap (from SYSTEM): " + htmlAttr);
  await shot(p, "j6x_d_theme_after1tap");
  await p.context().close();
}

/* ---------- H sandbox ---------- */
{
  const p = await (await ctx()).newPage();
  await p.goto("http://localhost:4203/lab", { waitUntil: "networkidle" });
  await p.waitForTimeout(1200);
  const inj = p.getByRole("button", { name: /inject/i }).first();
  await inj.scrollIntoViewIfNeeded();
  await inj.tap();
  await p.waitForTimeout(600);
  await shot(p, "j6x_h_sandbox_injected");
  const defBtn = p.getByRole("button", { name: /defense|defen[cs]e/i }).first();
  await defBtn.tap();
  await p.waitForTimeout(600);
  await shot(p, "j6x_h_sandbox_defense");
  const rankTxt = await p.evaluate(() => document.body.innerText.slice(0, 100));
  log.push("H lab head: " + rankTxt.replace(/\n/g, " | "));
  const ranked = await p.evaluate(() => {
    const rows = Array.from(document.querySelectorAll("ol li, [role='list'] > *"));
    return rows.slice(0, 12).map((r) => r.innerText?.replace(/\n/g, " ").slice(0, 60)).filter(Boolean).join(" || ");
  });
  log.push("H top rows after inject+defense: " + ranked.slice(0, 800));
  // theme: SYSTEM button in header
  await p.evaluate(() => window.scrollTo(0, 0));
  await p.waitForTimeout(300);
  const themeBtn = p.locator('button[aria-label^="Color scheme"]').first();
  await themeBtn.tap();
  await p.waitForTimeout(400);
  const themeLabel = await themeBtn.innerText().catch(() => "n/a");
  const htmlAttr = await p.evaluate(() => document.documentElement.getAttribute("data-theme") || document.documentElement.className);
  log.push(`H theme btn label after tap: "${themeLabel}", html attr: ${htmlAttr}`);
  await shot(p, "j6x_h_theme_after1tap");
  await p.context().close();
}

/* ---------- A theme toggle ---------- */
{
  const p = await (await ctx()).newPage();
  await p.goto("http://localhost:4201/", { waitUntil: "networkidle" });
  await p.waitForTimeout(800);
  const auto = p.locator('button[aria-label^="Color scheme"]').first();
  await auto.tap();
  await p.waitForTimeout(300);
  const label1 = await auto.innerText().catch(() => "n/a");
  const attr1 = await p.evaluate(() => document.documentElement.getAttribute("data-theme") || document.documentElement.className);
  await auto.tap();
  await p.waitForTimeout(300);
  const label2 = await auto.innerText().catch(() => "n/a");
  const attr2 = await p.evaluate(() => document.documentElement.getAttribute("data-theme") || document.documentElement.className);
  log.push(`A theme: AUTO -> tap1 label "${label1}" attr "${attr1}" -> tap2 label "${label2}" attr "${attr2}"`);
  await shot(p, "j6x_a_theme_after2taps");
  await p.context().close();
}

await browser.close();
fs.writeFileSync(OUT + "/j6x_log.txt", log.join("\n---\n"));
console.log(log.join("\n---\n"));
