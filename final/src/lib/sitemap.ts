// Relative imports (not "@/" aliases): this module is also imported by
// vite.config.ts, whose bundle resolves before the alias exists.
import { cases, caseBySlug } from "../content/cases";
import { noteById, notes } from "../content/notes";
import { homeTitle, site, titleSuffix } from "../content/site";

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

/* ------------------------- per-route head metadata ------------------------ */

/**
 * Head metadata for each sitemap path (Real Content & Cases pass). The build
 * writes every deep link as an HTTP-200 directory whose index.html carries
 * THIS metadata in <head> — honest static head output, not full body
 * prerendering (the app still client-renders; documented in the report).
 * Derived from the same content modules as the pages, so titles cannot drift.
 */
const STATIC_PAGE_META: Record<string, { title: string; description: string }> = {
  "/research": {
    title: "Research",
    description:
      "Research directions: retrieval-augmented generation, robustness, knowledge poisoning, AI security, systems, and the retrieval–generation interaction.",
  },
  "/work": {
    title: "Selected Work",
    description:
      "Real software with its evidence attached: a local-first inventory PWA, a browser-native sound workbench, and the archive itself.",
  },
  "/lab": {
    title: "Lab",
    description:
      "Hand-built, offline instruments: the Corruption Sandbox, Context Budget and Rankers Side-by-Side — every demo computes in your browser.",
  },
  "/notes": {
    title: "Notes",
    description: "Working notes from the archive's own engineering — read in place.",
  },
  "/publications": {
    title: "Publications",
    description: "Selected research, listed as records exist.",
  },
  "/about": {
    title: "About",
    description:
      "A computer science master's student working on retrieval-augmented generation and building small real software.",
  },
  "/connect": {
    title: "Connect",
    description: "Correspondence channels — listed as they exist, nothing staged.",
  },
};

export interface RouteHead {
  title: string;
  description: string;
  canonical: string;
}

export function routeHead(path: string): RouteHead {
  const base = site.url.endsWith("/") ? site.url : `${site.url}/`;
  const canonical = path === "/" ? base : `${base}${path.replace(/^\//, "")}`;
  if (path === "/") {
    return { title: homeTitle, description: site.description, canonical };
  }
  if (path.startsWith("/work/")) {
    const c = caseBySlug(path.slice("/work/".length));
    if (c) {
      return {
        title: `${c.title} — case study — ${titleSuffix}`,
        description: c.summary,
        canonical,
      };
    }
  }
  if (path.startsWith("/notes/")) {
    const n = noteById(path.slice("/notes/".length));
    if (n) {
      return { title: `${n.title} — ${titleSuffix}`, description: n.summary, canonical };
    }
  }
  const s = STATIC_PAGE_META[path];
  return {
    title: s ? `${s.title} — ${titleSuffix}` : titleSuffix,
    description: s?.description ?? site.description,
    canonical,
  };
}
