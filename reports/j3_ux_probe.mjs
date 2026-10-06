/** Judge 03 follow-up probes: skip link, arrows with many results, work tag buttons, hash deep links. */
import { chromium } from "playwright";
const BASE = "http://localhost:4183";
const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();

/* P1: skip link tabability */
await page.goto(BASE + "/", { waitUntil: "networkidle" });
await page.waitForTimeout(300);
const skipInfo = await page.evaluate(() => {
  const el = document.querySelector(".skip-link");
  if (!el) return { exists: false };
  const s = getComputedStyle(el);
  const r = el.getBoundingClientRect();
  return { exists: true, display: s.display, visibility: s.visibility, transform: s.transform, tabIndex: el.tabIndex, rect: { x: r.x, y: r.y, w: r.width, h: r.height }, disabled: el.hasAttribute("disabled") };
});
console.log("P1 skip-link computed:", JSON.stringify(skipInfo));
await page.keyboard.press("Tab");
const f1 = await page.evaluate(() => ({ tag: document.activeElement?.tagName, cls: document.activeElement?.className?.slice(0, 40), text: document.activeElement?.textContent?.trim().slice(0, 30) }));
console.log("P1 first Tab focus:", JSON.stringify(f1));
// tab again a few times to see order
const order = [];
for (let i = 0; i < 5; i++) {
  await page.keyboard.press("Tab");
  order.push(await page.evaluate(() => document.activeElement?.textContent?.trim().slice(0, 24) || document.activeElement?.tagName));
}
console.log("P1 tab order after first:", JSON.stringify(order));

/* P2: arrows with multiple results */
await page.keyboard.press("/").catch(() => {});
await page.evaluate(() => (document.activeElement instanceof HTMLElement ? document.activeElement.blur() : null));
await page.keyboard.press("/");
await page.waitForFunction(() => document.activeElement?.getAttribute?.("role") === "combobox");
await page.keyboard.type("re", { delay: 30 });
await page.waitForTimeout(150);
const n = await page.locator('#palette-list [role="option"]').count();
await page.keyboard.press("ArrowDown");
const ad1 = await page.locator('input[role="combobox"]').getAttribute("aria-activedescendant");
await page.keyboard.press("ArrowUp");
const ad2 = await page.locator('input[role="combobox"]').getAttribute("aria-activedescendant");
await page.keyboard.press("ArrowUp");
const ad3 = await page.locator('input[role="combobox"]').getAttribute("aria-activedescendant");
console.log(`P2 results=${n} after↓=${ad1} after↑=${ad2} after↑↑(wrap?)=${ad3}`);

/* P3: work page tag buttons open palette */
await page.keyboard.press("Escape");
await page.goto(BASE + "/work", { waitUntil: "networkidle" });
const tagBtn = page.locator('dd button[aria-label^="Search the site for"]').first();
const tagText = (await tagBtn.textContent())?.trim();
await tagBtn.click();
await page.waitForTimeout(250);
const comboOpen = await page.locator('input[role="combobox"]').count();
const prefill = comboOpen ? await page.locator('input[role="combobox"]').inputValue() : "(closed)";
console.log(`P3 work tag="${tagText}" paletteOpen=${comboOpen === 1} prefill="${prefill}"`);
await page.keyboard.press("Escape");

/* P4: hash deep link /research#q1 scrolls to the question */
await page.goto(BASE + "/research#q1", { waitUntil: "networkidle" });
await page.waitForTimeout(500);
const q1 = await page.evaluate(() => {
  const el = document.getElementById("q1");
  if (!el) return { exists: false };
  const r = el.getBoundingClientRect();
  return { exists: true, top: r.top, visible: r.top > -50 && r.top < 500 };
});
console.log("P4 /research#q1:", JSON.stringify(q1));

/* P5: publications ghost row + about page content */
await page.goto(BASE + "/publications", { waitUntil: "networkidle" });
const pubsText = (await page.locator("main").innerText()).replace(/\s+/g, " ");
console.log("P5 publications page:", pubsText.slice(0, 300));
await page.goto(BASE + "/about", { waitUntil: "networkidle" });
const aboutH = await page.locator("main h1").textContent();
const aboutLen = (await page.locator("main").innerText()).length;
const zh = await page.locator('p[lang="zh"]').count();
console.log(`P5 about: h1="${aboutH?.trim()}" chars=${aboutLen} zhParagraphs=${zh}`);

/* P6: theme cycle persistence + no FOUC (data-theme before paint) */
await page.goto(BASE + "/");
await page.evaluate(() => localStorage.setItem("concordance-theme", "dark"));
await page.reload({ waitUntil: "domcontentloaded" });
const themeEarly = await page.evaluate(() => document.documentElement.getAttribute("data-theme"));
const bgEarly = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
console.log(`P6 early theme=${themeEarly} bg=${bgEarly}`);
await page.evaluate(() => localStorage.removeItem("concordance-theme"));

/* P7: hero caret — the only persistent animation; does it run off-screen? */
const caretAnim = await page.evaluate(() => {
  const c = document.querySelector(".caret");
  if (!c) return null;
  return { animation: getComputedStyle(c).animationName, live: c.closest("[data-live]")?.dataset.live };
});
console.log("P7 hero caret:", JSON.stringify(caretAnim));

/* P8: mobile publications/about empty states in view */
const mctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
const mp = await mctx.newPage();
await mp.goto(BASE + "/publications", { waitUntil: "networkidle" });
const mPubs = (await mp.locator("main").innerText()).replace(/\s+/g, " ").slice(0, 200);
console.log("P8 mobile publications:", mPubs);
await mctx.close();

await browser.close();
