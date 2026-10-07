/**
 * Placeholder-pass QA matrix: the minimal, current screenshot set for
 * shots/final — 6 pages × desktop(1440) / mobile(390) × light / dark = 24
 * images. Served from the production build by `vite preview` (port 4199).
 * Usage: node reports/qa-matrix.mjs
 */
import { chromium } from "playwright";

const BASE = "http://localhost:4199";
const OUT = "D:/Codex/play/portfolio/shots/final";
const PAGES = ["", "/research", "/work", "/about", "/connect", "/publications"];
const NAME = { "": "home", "/research": "research", "/work": "work", "/about": "about", "/connect": "connect", "/publications": "publications" };
const VIEWPORTS = [
  { tag: "desktop", width: 1440, height: 900 },
  { tag: "mobile", width: 390, height: 844 },
];

const browser = await chromium.launch();
const consoleIssues = [];
for (const theme of ["light", "dark"]) {
  for (const vp of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      colorScheme: theme,
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();
    page.on("pageerror", (e) => consoleIssues.push(`${NAME[undefined] ?? ""}${vp.tag}/${theme}: ${String(e).slice(0, 120)}`));
    page.on("console", (m) => {
      if (m.type() === "error") consoleIssues.push(`${vp.tag}/${theme}: ${m.text().slice(0, 120)}`);
    });
    for (const route of PAGES) {
      await page.goto(BASE + route, { waitUntil: "networkidle" });
      await page.waitForTimeout(1500);
      const file = `${OUT}/${NAME[route]}.${vp.tag}.${theme}.png`;
      await page.screenshot({ path: file });
    }
    await context.close();
  }
}
await browser.close();
console.log(`24 shots -> ${OUT}; console issues: ${consoleIssues.length}`);
for (const issue of consoleIssues) console.log("  ", issue);
