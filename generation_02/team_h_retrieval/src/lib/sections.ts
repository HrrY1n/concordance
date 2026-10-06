/**
 * Section registry — the site's coordinate system. Every section has an
 * address (§00–§06); the palette cites these coordinates in its results.
 * Counts are derived from the content modules (honest readings, C-style).
 */
import { notes, publications } from "@/content/publications";
import { projects } from "@/content/projects";
import { researchQuestions, researchTopics } from "@/content/research";
import { budgetChunks, sandboxCorpus } from "@/content/lab";

export interface SectionMeta {
  num: string;
  id: string;
  title: string;
  route: string;
  kicker: string;
  /** Honest reading shown at the right edge of the section header. */
  reading: string;
}

export const sections: SectionMeta[] = [
  {
    num: "01",
    id: "research",
    title: "Research",
    route: "/research",
    kicker: "Directions & questions",
    reading: `${researchTopics.length} TOPICS · ${researchQuestions.length} QUESTIONS`,
  },
  {
    num: "02",
    id: "work",
    title: "Selected Work",
    route: "/work",
    kicker: "Evidence chains",
    reading: `${projects.length} CHAINS`,
  },
  {
    num: "03",
    id: "lab",
    title: "Lab",
    route: "/lab",
    kicker: "Hand-built instruments",
    reading: `2 DEMOS · 0MS NETWORK`,
  },
  {
    num: "04",
    id: "notes",
    title: "Notes",
    route: "/notes",
    kicker: "Working notes",
    reading: `${notes.length} ENTRIES`,
  },
  {
    num: "05",
    id: "publications",
    title: "Publications",
    route: "/publications",
    kicker: "Peer-reviewed work",
    reading: `${publications.length} RECORDS`,
  },
  {
    num: "06",
    id: "about",
    title: "About + Connect",
    route: "/about",
    kicker: "Who keeps this index",
    reading: "",
  },
];

export const sectionByRoute = (route: string): SectionMeta | undefined =>
  sections.find((s) => s.route === route);

/** One line, rendered in the footer: the corpus size, honestly counted. */
export const corpusReading = (): string =>
  [
    `WORK ${projects.length}`,
    `TOPICS ${researchTopics.length}`,
    `QUESTIONS ${researchQuestions.length}`,
    `NOTES ${notes.length}`,
    `PUBS ${publications.length}`,
    `LAB 2 DEMOS · ${sandboxCorpus.length + budgetChunks.length} RECORDS`,
  ].join(" · ");
