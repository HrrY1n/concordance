import type { TimelineEntry } from "./types";

/** CONTENT_PACK §timeline — a Now/Log, not a résumé. Only real entries live
 *  here; every line is checkable (the case studies link from §02). Newest
 *  first, per the About page's log grammar. */
export const timeline = [
  {
    sample: false,
    year: "2026-10",
    kind: "milestone",
    title: "Two case studies published — Private Item Library & SoundIsle",
    detail:
      "The archive grows its first real case pages: a local-first inventory PWA and a browser-native sound workbench, each with its evidence chain.",
  },
  {
    sample: false,
    year: "2026",
    kind: "milestone",
    title: "This site went online",
    detail: "The archive begins.",
  },
] satisfies TimelineEntry[];
