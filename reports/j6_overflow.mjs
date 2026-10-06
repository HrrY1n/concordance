/** J6 mobile audit — part 1: overflow scan (390/320/768) + perf totals. */
import { chromium } from "playwright";

const BASE = "http://localhost:4183";
const ROUTES = [
  "/", "/research", "/work", "/lab", "/lab/corruption-sandbox",
  "/notes", "/notes/n1", "/notes/n2", "/notes/n3",
  "/publications", "/about", "/connect", "/definitely-missing-404",
];

const browser = await chromium.launch();

async function scanViewport(width, height, label) {
  const ctx = await browser.newContext({
    viewport: { width, height }, isMobile: true, hasTouch: true,
    deviceScaleFactor: 2, colorScheme: "light",
  });
  const page = await ctx.newPage();
  const out = [];
  for (const route of ROUTES) {
    try {
      await page.goto(BASE + route, { waitUntil: "networkidle", timeout: 15000 });
    } catch { /* still check what rendered */ }
    await page.waitForTimeout(700);
    const r = await page.evaluate(() => {
      const vw = document.documentElement.clientWidth;
      const sw = document.documentElement.scrollWidth;
      const bw = document.body.scrollWidth;
      const wide = [];
      if (sw > vw || bw > vw) {
        document.querySelectorAll("body *").forEach((el) => {
          const b = el.getBoundingClientRect();
          if (b.width > vw + 1 || b.right > vw + 1) {
            const cls = (el.className && typeof el.className === "string") ? el.className.slice(0, 60) : "";
            wide.push(`${el.tagName.toLowerCase()}.${cls} w=${Math.round(b.width)} right=${Math.round(b.right)}`);
          }
        });
      }
      return { vw, sw, bw, wide: wide.slice(0, 6) };
    });
    out.push({ route, ...r });
  }
  await ctx.close();
  return { label, out };
}

const results = [];
results.push(await scanViewport(390, 844, "390x844"));
results.push(await scanViewport(320, 568, "320x568"));
results.push(await scanViewport(768, 1024, "768x1024"));

for (const vp of results) {
  console.log(`\n=== ${vp.label} ===`);
  for (const r of vp.out) {
    const bad = r.sw > r.vw || r.bw > r.vw;
    console.log(`${bad ? "FAIL" : "ok  "} ${r.route.padEnd(26)} vw=${r.vw} scrollW=${r.sw} bodyW=${r.bw}${r.wide.length ? "\n      " + r.wide.join("\n      ") : ""}`);
  }
}

// Perf: requests + transferred bytes on first and second route
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  const reqs = [];
  page.on("response", async (res) => {
    try { reqs.push({ url: res.url(), size: (await res.body()).length }); } catch {}
  });
  const t0 = Date.now();
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  const total = reqs.reduce((s, r) => s + r.size, 0);
  console.log(`\n=== PERF 390 cold load / ===`);
  console.log(`time=${Date.now() - t0}ms requests=${reqs.length} uncompressedBytes=${total}`);
  reqs.sort((a, b) => b.size - a.size).slice(0, 10).forEach(r => console.log(`  ${Math.round(r.size / 1024)}KB  ${r.url.split("/").pop().slice(0, 60)}`));
  // fonts check
  const fontReqs = reqs.filter(r => r.url.includes("/fonts/"));
  console.log(`fonts: ${fontReqs.length} files, ${Math.round(fontReqs.reduce((s, r) => s + r.size, 0) / 1024)}KB total (uncompressed)`);
  await ctx.close();
}

await browser.close();
