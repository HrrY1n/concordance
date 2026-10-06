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
  url: "https://example.com/",

  /** Dual-voice hero (sans = statement, serif italic = the human qualifier). */
  heroSans: ["Retrieval-augmented", "generation,"],
  heroSerif: "read at the level of the ranking.",
  heroLede:
    "I study what retrieval-grounded systems do when their evidence is noisy, conflicting, or deliberately poisoned — and I build small instruments that make those failure modes visible.",

  /** Connect page (M5): action-oriented, never a dead-end. */
  connectIntro:
    "The correspondence page. Channels appear here as they exist — nothing on this page is staged, and the fastest one is listed first.",
  connectFastest: "Fastest signal right now:",
  connectEmptyLine:
    "No public channels are configured yet. The slots below become real the moment src/content/links.ts does.",
  connectMailtoNote: "placeholder slot — set `email` in src/content/links.ts",

  /** Publications empty state (§05): academic etiquette, no staged progress. */
  publicationsEmptyTitle: "Selected research will appear here.",
  publicationsEmptyBody:
    "Nothing is in review, nothing is staged. When peer-reviewed work exists, it will be listed with its evidence chain — venue, code, data, and the question it answers.",
  publicationsReserved: "RESERVED — this line auto-numbers when publications.ts grows",

  /** Palette */
  searchLabel: "Query this site",
  searchPlaceholder: "query this concordance — try “poisoning”",
} as const;

/** The hero identity line — composed from real profile data only. */
export const heroIdentity = profile.identity.join(" · ");
