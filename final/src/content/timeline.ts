import type { TimelineEntry } from "./types";

/** CONTENT_PACK §timeline — a Now/Log, not a résumé. Only real entries live
 *  here; every line is checkable. Release-candidate review: the "case
 *  studies published" milestone was removed — the cases live on an
 *  unmerged, undeployed branch, and a log entry cannot outrun reality. The
 *  archive's going-online stays the first true event. */
export const timeline = [
  {
    sample: false,
    year: "2026",
    kind: "milestone",
    title: "This site went online",
    detail: "The archive begins.",
  },
] satisfies TimelineEntry[];
