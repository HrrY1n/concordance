import type { TimelineEntry } from "./types";

// Kept in the content layer for future growth; the UI does not render a
// timeline section in this edition (see DESIGN_NOTES — rejected scope).
export const timeline: TimelineEntry[] = [
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
];
