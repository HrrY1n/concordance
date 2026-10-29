/// <reference types="vitest/config" />
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import fs from "node:fs";
import { fileURLToPath, URL } from "node:url";
// Relative imports: the config bundle resolves before the "@" alias exists.
import { routeHead, sitemapPaths, sitemapUrls } from "./src/lib/sitemap";
import { site, brand } from "./src/content/site";
import { profile } from "./src/content/profile";

const escapeAttr = (s: string): string => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

/** Sets content="…" on a meta tag identified by name|property, regardless of
 *  attribute order (the built shell emits content first). */
function setMetaContent(html: string, key: string, value: string): string {
  const tagRe = new RegExp(`<meta\\s[^>]*\\b(?:name|property)="${key}"[^>]*>`);
  return html.replace(tagRe, (tag) => tag.replace(/\bcontent="[^"]*"/, `content="${escapeAttr(value)}"`));
}

/**
 * Patches the built shell's head for one route: title, description, canonical
 * and og:url/og:title/og:description. The build-time transform has already
 * replaced the __SITE_*__ tokens, so we patch the final values.
 */
function patchRouteHead(html: string, head: ReturnType<typeof routeHead>): string {
  let out = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeAttr(head.title)}</title>`);
  out = setMetaContent(out, "description", head.description);
  out = setMetaContent(out, "og:title", head.title);
  out = setMetaContent(out, "og:description", head.description);
  out = out.replace(/<link rel="canonical" href="[^"]*"/, `<link rel="canonical" href="${escapeAttr(head.canonical)}"`);
  out = out.replace(/<meta property="og:url" content="[^"]*"/, `<meta property="og:url" content="${escapeAttr(head.canonical)}"`);
  return out;
}

/**
 * Writes dist/robots.txt alongside the sitemap on every build, both derived
 * from site.url (P0-1). Nothing in public/ carries a URL any more — the one
 * place a hosting change touches is content/site.ts.
 *
 * Real Content & Cases pass — static deep links: every sitemap path is also
 * emitted as dist<path>/index.html (a copy of the shell with the route's own
 * head metadata), so a cold request to /concordance/work/item-storage-app is
 * HTTP 200 with correct title/description/canonical/og. This is static head
 * output, NOT full body prerendering — the SPA still renders the view on
 * load; the Pages 404.html SPA fallback stays as the safety net.
 */
function concordanceSitemap(): Plugin {
  return {
    name: "concordance-sitemap",
    apply: "build",
    writeBundle() {
      const dist = new URL("./dist/", import.meta.url);
      const urls = sitemapUrls();
      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u}</loc></url>`).join("\n")}
</urlset>
`;
      fs.writeFileSync(new URL("sitemap.xml", dist), xml);
      const robots = `User-agent: *
Allow: /

Sitemap: ${site.url}sitemap.xml
`;
      fs.writeFileSync(new URL("robots.txt", dist), robots);

      const shell = fs.readFileSync(new URL("index.html", dist), "utf8");
      for (const path of sitemapPaths()) {
        if (path === "/") continue; // the shell itself is the root route
        const dir = new URL(`.${path}/`, dist);
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(new URL("index.html", dir), patchRouteHead(shell, routeHead(path)));
      }
    },
  };
}

/**
 * Production URL / brand single source (P0-1, P2-1): index.html carries
 * __SITE_URL__ / __SITE_BRAND__ tokens; this transform swaps them for the
 * values from content/site.ts at build AND in dev, so canonical, og:url,
 * og:image (subpath included via the trailing slash), twitter:image and
 * JSON-LD can never drift from the content layer.
 */
function concordanceMeta(): Plugin {
  const homeTitle = brand === site.name ? `${site.name} — Research Archive` : brand;
  // Structured data (placeholder pass): while no real name is configured, the
  // site publishes a neutral WebSite schema — never a Person schema with an
  // unconfirmed jobTitle or sample "knowsAbout" claims. A configured name
  // switches it to a minimal Person schema, derived here from profile.ts.
  const jsonLd = profile.name
    ? { "@context": "https://schema.org", "@type": "Person", name: profile.name, url: site.url }
    : {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: site.name,
        url: site.url,
        description: site.description,
      };
  return {
    name: "concordance-meta",
    transformIndexHtml(html) {
      return html
        .replaceAll("__SITE_JSON_LD__", JSON.stringify(jsonLd))
        .replaceAll("__SITE_URL__", site.url)
        .replaceAll("__SITE_BRAND__", site.name)
        .replaceAll("__SITE_HOME_TITLE__", homeTitle);
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
    plugins: [react(), tailwindcss(), concordanceMeta(), ...(isSingle ? [] : [concordanceSitemap()])],
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
