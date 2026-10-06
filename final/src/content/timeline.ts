import type { TimelineEntry } from "./types";

/** CONTENT_PACK §timeline — a Now/Log, not a résumé. The 20XX rows are
 *  explicit TODOs; they render as themselves. */
export const timeline = [
  {
    sample: true,
    year: "20XX",
    kind: "education",
    title: "TODO — your degree",
    detail: "Replace in src/content/timeline.ts.",
  },
  {
    sample: true,
    year: "20XX",
    kind: "research",
    title: "TODO — research role or internship",
    detail: "Replace in src/content/timeline.ts.",
  },
  {
    sample: true,
    year: "2026",
    kind: "milestone",
    title: "This site went online",
    detail: "The archive begins.",
  },
] satisfies TimelineEntry[];
