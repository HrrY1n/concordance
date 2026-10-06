#!/usr/bin/env node
/**
 * Finishes the `--mode single` build: inlines the JS chunk and the CSS into
 * dist-single/index.html so the file works when double-clicked from Explorer
 * (file:// blocks external module scripts and stylesheet fetches).
 *
 * - <script type="module" src="./assets/*.js">  → inline <script type="module">
 * - <link rel="stylesheet" href="./assets/*.css"> → inline <style> (fonts
 *   re-pointed from /fonts/ to fonts/, copied next to the html)
 * - font preload hrefs rewritten the same way
 * - dist-single/assets removed after inlining
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const dir = path.join(root, "dist-single");
const htmlPath = path.join(dir, "index.html");
if (!fs.existsSync(htmlPath)) {
  console.error("make-singlefile: dist-single/index.html not found — run `vite build --mode single` first.");
  process.exit(1);
}

let html = fs.readFileSync(htmlPath, "utf8");
const errors = [];

// file:// origins are opaque: external font fetches are CORS-blocked. Embed
// every public font as a data URL and drop the (now meaningless) preloads.
const fontDir = path.join(root, "public", "fonts");
const fontData = new Map();
for (const f of fs.readdirSync(fontDir)) {
  fontData.set(`/fonts/${f}`, `data:font/woff2;base64,${fs.readFileSync(path.join(fontDir, f)).toString("base64")}`);
}
html = html.replace(/<link rel="preload"[^>]*as="font"[^>]*>\s*/g, "");

// Inline every stylesheet, embedding fonts as data URLs.
html = html.replace(
  /<link rel="stylesheet"[^>]*href="([^"]+)"\s*\/?>/g,
  (_m, href) => {
    const cssPath = path.join(dir, href.replace(/^\.?\//, ""));
    if (!fs.existsSync(cssPath)) {
      errors.push(`stylesheet missing: ${href}`);
      return "";
    }
    let css = fs.readFileSync(cssPath, "utf8");
    for (const [ref, data] of fontData) {
      // Vite rebases public urls to "../fonts/…" when base is "./" — handle
      // both that and the absolute form.
      css = css.replaceAll(`../fonts/${path.basename(ref)}`, data);
      css = css.replaceAll(ref, data);
    }
    if (/\/fonts\//.test(css)) errors.push("unresolved font reference in css");
    return `<style>\n${css}\n</style>`;
  },
);

// Inline the module entry (single mode ships exactly one chunk).
html = html.replace(
  /<script type="module"[^>]*src="([^"]+)"[^>]*><\/script>/g,
  (_m, src) => {
    const jsPath = path.join(dir, src.replace(/^\.?\//, ""));
    if (!fs.existsSync(jsPath)) {
      errors.push(`script missing: ${src}`);
      return "";
    }
    const js = fs.readFileSync(jsPath, "utf8").replaceAll("</script>", "<\\/script>");
    return `<script type="module">\n${js}\n</script>`;
  },
);

// Nothing external should remain: the assets dir is inlined, fonts are data.
fs.rmSync(path.join(dir, "assets"), { recursive: true, force: true });
fs.rmSync(path.join(dir, "fonts"), { recursive: true, force: true });

fs.writeFileSync(htmlPath, html);

if (errors.length) {
  console.error("make-singlefile FAILED:", errors.join("; "));
  process.exit(1);
}
const size = (fs.statSync(htmlPath).size / 1024).toFixed(0);
console.log(`make-singlefile: OK — dist-single/index.html (${size} KB, self-contained)`);
