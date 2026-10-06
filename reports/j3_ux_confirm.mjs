/** Final confirmation: cold-load hash scroll permanence + skip-link hide-pattern experiment. */
import { chromium } from "playwright";
const BASE = "http://localhost:4183";
const browser = await chromium.launch();

/* C1: true cold context, wait 3.5s — does the hash scroll ever happen? */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + "/research#q1", { waitUntil: "networkidle" });
  await page.waitForTimeout(3500);
  const r = await page.evaluate(() => {
    const el = document.getElementById("q1");
    return { scrollY: window.scrollY, top: el ? el.getBoundingClientRect().top : null };
  });
  console.log("C1 cold #q1 after 3.5s:", JSON.stringify(r));
  await ctx.close();
}

/* C2: cold load /work#plate-poison-sandbox style hash (another lazy route) */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + "/work#plate-this-site", { waitUntil: "networkidle" });
  await page.waitForTimeout(2500);
  const r = await page.evaluate(() => {
    const el = document.getElementById("plate-this-site");
    return { scrollY: window.scrollY, top: el ? el.getBoundingClientRect().top : null, exists: !!el };
  });
  console.log("C2 cold /work#plate-this-site:", JSON.stringify(r));
  await ctx.close();
}

/* C3: minimal repro — is transform-hide the reason Tab skips a fixed skip link? */
{
  const html = `<!doctype html><html><head><style>
    .a { position: fixed; top: 8px; left: 8px; transform: translateY(-300%); }
    .a:focus { transform: none; }
    .b { position: fixed; top: -60px; left: 8px; }
    .b:focus { top: 8px; }
    .c { position: fixed; top: 8px; left: -200px; }
    .c:focus { left: 8px; }
  </style></head><body>
    <a class="a" href="#x">SKIP-TRANSFORM</a>
    <a class="b" href="#x">SKIP-TOP</a>
    <a class="c" href="#x">SKIP-LEFT</a>
    <main><button>content-btn</button></main>
  </body></html>`;
  const ctx = await browser.newContext({ viewport: { width: 800, height: 600 } });
  const page = await ctx.newPage();
  await page.setContent(html);
  await page.focus("button");
  await page.evaluate(() => document.activeElement?.blur());
  const order = [];
  for (let i = 0; i < 5; i++) {
    await page.keyboard.press("Tab");
    order.push(await page.evaluate(() => document.activeElement?.textContent?.trim()));
  }
  console.log("C3 tab order:", JSON.stringify(order));
  await ctx.close();
}

await browser.close();
