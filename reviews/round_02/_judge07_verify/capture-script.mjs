import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const out = "D:/Codex/play/portfolio/reviews/round_02/_judge07_verify";
mkdirSync(out, { recursive: true });
const browser = await chromium.launch();

// ---- Team D (port 4174) ----
const d = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await d.goto("http://localhost:4174/", { waitUntil: "networkidle" });
await d.waitForTimeout(400);
await d.screenshot({ path: out + "/d-hero-400ms.png" });
await d.waitForTimeout(1600);
await d.screenshot({ path: out + "/d-hero-2s.png" });
// scroll through the page to trigger whileInView reveals
await d.evaluate(async () => {
  const h = document.body.scrollHeight;
  for (let y = 0; y <= h; y += 350) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 50));
  }
});
await d.waitForTimeout(800);
for (const id of ["research", "ledger", "publications", "work"]) {
  await d.evaluate((sel) => document.getElementById(sel)?.scrollIntoView(), id);
  await d.waitForTimeout(700);
  await d.screenshot({ path: out + `/d-${id}.png` });
}

// ---- Team H (port 4175) ----
const h = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await h.goto("http://localhost:4175/research", { waitUntil: "networkidle" });
await h.waitForTimeout(1200);
await h.screenshot({ path: out + "/h-research-full.png", fullPage: true });
await h.goto("http://localhost:4175/work", { waitUntil: "networkidle" });
await h.waitForTimeout(600);
await h.screenshot({ path: out + "/h-work.png" });

// ---- Team A (port 4173) ----
const a = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await a.goto("http://localhost:4173/", { waitUntil: "networkidle" });
await a.waitForTimeout(2000);
for (const id of ["research", "publications", "lab"]) {
  await a.evaluate((sel) => document.getElementById(sel)?.scrollIntoView(), id);
  await a.waitForTimeout(500);
  await a.screenshot({ path: out + `/a-${id}.png` });
}
await browser.close();
console.log("verify shots done");
