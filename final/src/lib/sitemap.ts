// Relative imports (not "@/" aliases): this module is also imported by
// vite.config.ts, whose bundle resolves before the alias exists.
import { cases } from "../content/cases";
import { notes } from "../content/notes";
import { site } from "../content/site";

/**
 * Single source for sitemap URLs (P1-18): static routes, one entry per case
 * study, one per published note — derived from content at build time.
 *
 * Consumed by the concordance-sitemap vite plugin (vite.config.ts, writes
 * dist/sitemap.xml on every build), by the static-route emitter (which turns
 * every deep link into an HTTP-200 directory with its own head metadata),
 * and guarded by sitemap.test.ts.
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
    ...cases.map((c) => `/work/${c.slug}`),
    ...notes.map((note) => `/notes/${note.id}`),
  ];
}

export function sitemapUrls(): string[] {
  const base = site.url.endsWith("/") ? site.url : `${site.url}/`;
  const urls = sitemapPaths().map((path) => (path === "/" ? base : `${base}${path.replace(/^\//, "")}`));
  return [...new Set(urls)].sort();
}
