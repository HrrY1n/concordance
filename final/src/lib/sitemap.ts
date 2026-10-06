// Relative imports (not "@/" aliases): this module is also imported by
// vite.config.ts, whose bundle resolves before the alias exists.
import { notes } from "../content/notes";
import { site } from "../content/site";

/**
 * Single source for sitemap URLs (P1-18): static routes plus one entry per
 * published note, derived from content at build time — adding a fourth note
 * to notes.ts is the whole job; nothing else is hand-maintained.
 *
 * Consumed by the concordance-sitemap vite plugin (vite.config.ts, writes
 * dist/sitemap.xml on every build) and guarded by sitemap.test.ts.
 */
const STATIC_ROUTES = [
  "/",
  "/research",
  "/work",
  "/lab",
  "/lab/corruption-sandbox",
  "/notes",
  "/publications",
  "/about",
  "/connect",
] as const;

export function sitemapPaths(): string[] {
  return [
    ...STATIC_ROUTES,
    ...notes.map((note) => `/notes/${note.id}`),
  ];
}

export function sitemapUrls(): string[] {
  const base = site.url.endsWith("/") ? site.url : `${site.url}/`;
  const urls = sitemapPaths().map((path) => (path === "/" ? base : `${base}${path.replace(/^\//, "")}`));
  return [...new Set(urls)].sort();
}
