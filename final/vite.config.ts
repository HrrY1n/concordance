/// <reference types="vitest/config" />
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import fs from "node:fs";
import { fileURLToPath, URL } from "node:url";
// Relative imports: the config bundle resolves before the "@" alias exists.
import { sitemapUrls } from "./src/lib/sitemap";

/**
 * Writes dist/sitemap.xml on every build, derived from content the same way
 * the site's own honest readings are (P1-18). Hand-maintaining note URLs
 * would make the fourth note a silent SEO failure; this plugin plus
 * sitemap.test.ts make that drift impossible.
 */
function concordanceSitemap(): Plugin {
  return {
    name: "concordance-sitemap",
    apply: "build",
    writeBundle() {
      const urls = sitemapUrls();
      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u}</loc></url>`).join("\n")}
</urlset>
`;
      fs.writeFileSync(new URL("./dist/sitemap.xml", import.meta.url), xml);
    },
  };
}

export default defineConfig(({ mode }) => {
  // `--mode single` produces dist-single/: one self-contained index.html you
  // can double-click from Explorer (file:// blocks external module scripts,
  // so the JS/CSS must be inlined; scripts/make-singlefile.mjs finishes it).
  const isSingle = mode === "single";
  return {
    // VITE_BASE for subpath hosting (GitHub Pages project sites);
    // "./" for the double-clickable single-file build; "/" otherwise.
    base: process.env.VITE_BASE || (isSingle ? "./" : "/"),
    plugins: [react(), tailwindcss(), ...(isSingle ? [] : [concordanceSitemap()])],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    define: {
      // Real build timestamp — rendered in the colophon as an honest reading.
      __BUILD_DATE__: JSON.stringify(new Date().toISOString().slice(0, 10)),
    },
    build: {
      ...(isSingle
        ? {
            outDir: "dist-single",
            cssCodeSplit: false,
            assetsInlineLimit: 100_000_000,
            rollupOptions: { output: { inlineDynamicImports: true } },
          }
        : {}),
    },
    test: {
      environment: "node",
      include: ["src/**/*.test.{ts,tsx}"],
    },
  };
});
