import type { Chapter } from "./types";

// Chapter numbering (00–07) doubles as navigation anchors (stolen from F,
// re-spoken as a monograph's table of contents).
export const chapters: Chapter[] = [
  { no: "00", id: "top", title: "Frontispiece", blurb: "" },
  { no: "01", id: "about", title: "About", blurb: "Who is writing this." },
  {
    no: "02",
    id: "research",
    title: "Research",
    blurb: "Six directions, four open questions.",
  },
  {
    no: "03",
    id: "work",
    title: "Selected Work",
    blurb: "Four plates. Built, not claimed.",
  },
  {
    no: "04",
    id: "publications",
    title: "Publications",
    blurb: "The ledger is open.",
  },
  {
    no: "05",
    id: "lab",
    title: "Lab",
    blurb: "Offline instruments for the ideas above.",
  },
  {
    no: "06",
    id: "notes",
    title: "Notes",
    blurb: "Thinking in public, as it happens.",
  },
  {
    no: "07",
    id: "connect",
    title: "Connect",
    blurb: "Correspondence.",
  },
];

/** Nav chapters (the frontispiece is reached by the wordmark). */
export const navChapters = chapters.filter((c) => c.id !== "top");
