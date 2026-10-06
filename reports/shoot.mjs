#!/usr/bin/env node
/**
 * Screenshot + console-error pipeline for design reviews.
 *
 * Usage:
 *   node shoot.mjs <url> <outPrefix> [--pages /,/research,/lab] [--full] [--wait 1200]
 *
 * Produces for each (page × viewport × theme):
 *   <outPrefix>.<route>.<viewport>.<theme>.png   (viewport shot of top)
 *   <outPrefix>.<route>.<viewport>.<theme>.full.png (only with --full)
 * plus <outPrefix>.console.json — console messages, page errors, request failures.
 *
 * Viewports: 1440x900 desktop, 390x844 mobile (iPhone-ish), 768x1024 tablet.
 */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const url = args[0];
const prefix = args[1];
if (!url || !prefix) {
  console.error("Usage: node shoot.mjs <url> <outPrefix> [--pages /,/research] [--full] [--wait 1200]");
  process.exit(1);
}
const getOpt = (name, def) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : def;
};
const routes = (getOpt("--pages", "home") || "home")
  .split(",")
  .map((s) => s.trim())
  .map((r) => {
    // Git Bash MSYS path conversion can mangle "/" into a Windows path; "home" alias -> "/"
    if (r === "home" || /^[A-Za-z]:/.test(r) || r === "/" || r.includes("Program Files")) return "/";
    return r.startsWith("/") ? r : "/" + r;
  });
const full = args.includes("--full");
const waitMs = Number(getOpt("--wait", "1400"));

const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
  { name: "tablet", width: 768, height: 1024 },
];
const themes = ["light", "dark"];

fs.mkdirSync(path.dirname(prefix) || ".", { recursive: true });
const consoleLog = [];

const browser = await chromium.launch();
try {
  for (const route of routes) {
    for (const theme of themes) {
      for (const vp of viewports) {
        const context = await browser.newContext({
          viewport: { width: vp.width, height: vp.height },
          colorScheme: theme,
          deviceScaleFactor: 1,
        });
        const page = await context.newPage();
        const tag = `${path.basename(prefix)}.${route === "/" ? "home" : route.replaceAll("/", "")}.${vp.name}.${theme}`;
        page.on("console", (m) => {
          if (["error", "warning"].includes(m.type()))
            consoleLog.push({ tag, type: m.type(), text: m.text().slice(0, 300) });
        });
        page.on("pageerror", (e) => consoleLog.push({ tag, type: "pageerror", text: String(e).slice(0, 300) }));
        page.on("requestfailed", (r) =>
          consoleLog.push({ tag, type: "requestfailed", text: `${r.url()} ${r.failure()?.errorText}`.slice(0, 300) }),
        );
        try {
          await page.goto(new URL(route, url).href, { waitUntil: "networkidle", timeout: 30000 });
        } catch {
          await page.waitForTimeout(2000);
        }
        await page.waitForTimeout(waitMs); // let entry animations settle
        await page.screenshot({ path: `${prefix}.${tag}.png` });
        if (full) await page.screenshot({ path: `${prefix}.${tag}.full.png`, fullPage: true });
        await context.close();
      }
    }
  }
} finally {
  await browser.close();
}
fs.writeFileSync(`${prefix}.console.json`, JSON.stringify(consoleLog, null, 2));
console.log(`done: ${routes.length * 2 * 3} shots -> ${prefix}.*.png; console issues: ${consoleLog.length}`);
