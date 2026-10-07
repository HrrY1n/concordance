import type { TimelineEntry } from "./types";

/** CONTENT_PACK §timeline — a Now/Log, not a résumé. Honesty rule (placeholder
 *  pass): developer TODOs never render to visitors. Only real entries live
 *  here; the archive's own going-online is the first true event. Sample rows
 *  (if one is ever staged) are filtered out of the public Log by AboutPage. */
export const timeline = [
  {
    sample: false,
    year: "2026",
    kind: "milestone",
    title: "This site went online",
    detail: "The archive begins.",
  },
] satisfies TimelineEntry[];
