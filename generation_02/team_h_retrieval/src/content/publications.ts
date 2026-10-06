import type { Publication, Note, TimelineEntry, Links } from "./types";

/** CONTENT_PACK §publications — empty by design. Triggers the reserved empty state. */
export const publications: Publication[] = [];

/** CONTENT_PACK §notes — three sample entries. */
export const notes: Note[] = [
  {
    id: "n1",
    sample: true,
    date: "2026-08-14",
    kind: "paper-reading",
    title: "Poisoning is a retrieval problem before it is a model problem",
    summary:
      "Reading notes on why poisoned content mostly wins at the ranking stage, and why generation-side defenses start too late.",
  },
  {
    id: "n2",
    sample: true,
    date: "2026-06-02",
    kind: "note",
    title: "Evaluating robustness without a poisoned test set",
    summary:
      "An argument for perturbation-based evaluation: measure stability under corpus change instead of hunting specific attacks.",
  },
  {
    id: "n3",
    sample: true,
    date: "2026-04-19",
    kind: "engineering",
    title: "Chunk boundaries are policy decisions",
    summary:
      "What I learned building a small retrieval pipeline: chunking quietly encodes assumptions about what counts as one piece of evidence.",
  },
];

/**
 * CONTENT_PACK §timeline. Kept in the data contract but not rendered: two of
 * three entries are explicit TODO placeholders, and printing "TODO — your
 * degree" to visitors would be less honest than not printing a record at all.
 * See DESIGN_NOTES → "Rejected".
 */
export const timeline: TimelineEntry[] = [
  { sample: true, year: "20XX", kind: "education", title: "TODO — your degree", detail: "Replace in src/content/timeline.ts." },
  { sample: true, year: "20XX", kind: "research", title: "TODO — research role or internship", detail: "Replace in src/content/timeline.ts." },
  { sample: true, year: "2026", kind: "milestone", title: "This site went online", detail: "The archive begins." },
];

/** CONTENT_PACK §links — every channel is null. Connect renders one restrained line. */
export const links: Links = {
  email: null,
  github: null,
  scholar: null,
  orcid: null,
  linkedin: null,
  rss: null,
};
