/**
 * Site-level editorial voice. Copy that is about the site itself (wordmark,
 * hero composition, connect grammar) lives here so the rest of src never
 * hardcodes it. `sample: true` — editorial voice, replace in this file.
 */
import { profile } from "./profile";

export const site = {
  sample: true,

  /** The site's own name — a concordance is a printed retrieval index: the
   *  one artifact that is both a book and a search system. */
  name: "Concordance",
  tagline: "A working concordance of one researcher's corpus.",
  description:
    "A research archive built as a concordance: retrieval-augmented generation, its robustness, knowledge poisoning, and the systems around them — every figure computed in your browser, every reading counted from the data.",
  /** PRODUCTION URL — the single source of truth. index.html's canonical /
   *  og: / twitter: / JSON-LD tags carry a __SITE_URL__ token that a Vite
   *  build-time transform replaces with this value, and robots.txt +
   *  sitemap.xml are generated from it (see vite.config.ts). Changing the
   *  hosting domain is a ONE-LINE edit here; nothing else can drift. */
  url: "https://hrry1n.github.io/concordance/",

  /** Dual-voice hero (sans = statement, serif italic = the human qualifier). */
  heroSans: ["Retrieval-augmented", "generation,"],
  heroSerif: "read at the level of the ranking.",
  heroLede:
    "An archive about what retrieval-grounded systems do when their evidence turns noisy, " +
    "conflicting, or deliberately poisoned — with small instruments that make those " +
    "failure modes visible.",

  /** Connect page (M5): action-oriented, never a dead-end. Copy stays in
   *  human language — file paths for maintainers live in CONTENT_GUIDE.md. */
  connectIntro:
    "The correspondence page. Channels appear here as they exist — nothing on this page is staged, and the fastest one is listed first.",
  connectFastest: "Fastest signal right now:",
  /** All-null Connect state (placeholder pass): one calm sentence, no slots,
   *  no engineering terms. Channel rows return the moment links exist. */
  connectEmptyTitle: "Contact details will be added later.",

  /** Publications empty state (§05): describes the ARCHIVE's records only —
   *  never the person's real-world submission state (placeholder pass). */
  publicationsEmptyTitle: "Selected research will appear here.",
  publicationsEmptyBody:
    "No publication records have been added to this archive yet. When work exists, it will be listed with its evidence chain — venue, code, data, and the question it answers.",
  publicationsReserved: "RESERVED — the next record numbers itself here",

  /** Palette */
  searchLabel: "Query this site",
  searchPlaceholder: "query this concordance — try “poisoning”",
} as const;

/** The hero identity line — composed from real profile data only. */
export const heroIdentity = profile.identity.join(" · ");

/** Brand compatibility (production pass): the moment a real name exists, the
 *  wordmark, titles and og metadata become "[NAME] — Concordance" everywhere —
 *  one data edit in profile.ts, zero redesign. Until then the site brand
 *  stands alone. Consumers: Header wordmark, lib/seo.ts, index.html transform. */
export const brand = profile.name ? `${profile.name} — Concordance` : "Concordance";

/** Page-title grammar: the home title, and the suffix every other page gets.
 *  (Home keeps the descriptive subtitle while the site is anonymous; once a
 *  name exists the brand itself carries the title.) */
export const homeTitle = profile.name ? brand : "Concordance — Research Archive";
export const titleSuffix = profile.name ?? "Concordance";
