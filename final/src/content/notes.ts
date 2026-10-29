import type { Note } from "./types";

/**
 * CONTENT_PACK §notes — Real Content & Cases pass. The three first-person
 * sample notes (n1–n3) were REMOVED, not rewritten: no fictional personal
 * history stays in the visitor-visible data. What remains is one engineering
 * note about this archive itself — every claim checkable against the public
 * repository you are reading the note on.
 *
 * A draft note lives outside the content system (docs/drafts/) until the
 * owner promotes it; nothing else auto-enters this ledger.
 */
export const notes = [
  {
    id: "archive-as-instrument",
    sample: false,
    date: "2026-10-30",
    kind: "engineering",
    title: "The archive is the instrument",
    summary:
      "How this site is built: content as typed TypeScript, readings derived instead of written, and a retrieval index that runs where you read.",
    body: [
      {
        type: "p",
        text: "Most portfolio sites are documents: fixed pages that quietly rot as the underlying facts change. This archive takes the opposite bet — it behaves like its namesake. A printed concordance is both a book and an index; every entry in it points back to something that actually exists. So the site's first-class objects are data files, not pages, and everything a visitor reads about the site — counts, dates, section readings — is computed from those files at render time.",
        sidenote: {
          n: 1,
          text: "The colophon at the bottom of every page prints WORK / TOPICS / QUESTIONS / NOTES / PUBS counts. None of those numbers is hand-written; each is a .length somewhere in src/lib/sections.ts.",
        },
      },
      {
        type: "p",
        text: "Typing the content buys more than autocomplete. Cross-references between files — a research question citing a demo, a topic adjoining another topic — are literal union types, so a typo'd reference is a compile error, not a silently dead link. The evidence chains under each work plate are keyed the same way: adding a project without evidence fails the build.",
      },
      {
        type: "p",
        text: "The retrieval index is the second half of the metaphor. The palette (Ctrl+K) searches a local index of records — pages, projects, topics, notes, demos — and a second layer splits note bodies and demo corpora into sentences, ranked with the site's own BM25 implementation. A hit renders as a KWIC citation line, the way a printed concordance quotes its term in context.",
        sidenote: {
          n: 2,
          text: "bm25 with k1 = 1.5, b = 0.75 — the same parameters the Corruption Sandbox displays. The parameters are not hidden in a config file; they are part of the copy.",
        },
      },
      {
        type: "p",
        text: "Deriving structure from content reaches the build output too. The sitemap is not a hand-maintained XML file; it is a function over the content modules. Publishing a new note extends the sitemap as a side effect of the note existing:",
      },
      {
        type: "code",
        lang: "ts",
        caption: "src/lib/sitemap.ts — routes derived from content",
        text: `export function sitemapPaths(): string[] {
  return [
    ...STATIC_ROUTES,
    ...notes.map((note) => \`/notes/\${note.id}\`),
  ];
}`,
      },
      {
        type: "p",
        text: "The same discipline sets the site's honesty budget. Entries that are examples rather than records carry a sample flag in the data, and the pages derive their wording from it — a sample entry says so wherever it renders, and the colophon flips its line the moment no sample entries remain. That is the whole trick: make the honest sentence the cheap one to render, and the expensive one to fake.",
      },
    ],
  },
] satisfies Note[];

export const noteById = (slug: string): Note | undefined =>
  notes.find((n) => n.id === slug);
