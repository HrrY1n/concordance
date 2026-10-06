import { navChapters } from "../content/chapters";
import { notes } from "../content/notes";
import { projects } from "../content/projects";
import { researchQuestions, researchTopics } from "../content/research";
import { labDemos } from "../content/lab";
import { tokenize } from "./retrieval";

export type SearchType = "CHAPTER" | "TOPIC" | "QUESTION" | "WORK" | "NOTE" | "LAB";

export interface SearchEntry {
  id: string;
  type: SearchType;
  /** mono type label shown in the result row */
  label: string;
  title: string;
  meta?: string;
  text?: string;
  /** anchor id to navigate to */
  target: string;
}

/**
 * Pure front-end index, built from the typed content modules — the same
 * arrays that render the page. Nothing is hand-copied, so the index can
 * never drift from the content.
 */
export const searchIndex: SearchEntry[] = [
  ...navChapters.map((c) => ({
    id: `chapter-${c.id}`,
    type: "CHAPTER" as const,
    label: "§" + c.no,
    title: c.title,
    text: c.blurb,
    target: c.id,
  })),
  ...researchTopics.map((t) => ({
    id: `topic-${t.id}`,
    type: "TOPIC" as const,
    label: "TOPIC",
    title: t.name,
    meta: t.short,
    text: t.blurb,
    target: "research",
  })),
  ...researchQuestions.map((q) => ({
    id: `question-${q.id}`,
    type: "QUESTION" as const,
    label: "QUESTION",
    title: q.text,
    meta: q.status.toUpperCase(),
    target: "research",
  })),
  ...projects.map((p) => ({
    id: `work-${p.id}`,
    type: "WORK" as const,
    label: "WORK",
    title: p.title,
    meta: p.tags.join(" · "),
    text: p.summary,
    target: "work",
  })),
  ...notes.map((n) => ({
    id: `note-${n.id}`,
    type: "NOTE" as const,
    label: "NOTE",
    title: n.title,
    meta: n.date,
    text: n.summary,
    target: "notes",
  })),
  ...labDemos.map((d) => ({
    id: `lab-${d.id}`,
    type: "LAB" as const,
    label: "LAB",
    title: d.title,
    meta: d.label,
    text: d.line,
    target: "lab",
  })),
];

/** Simple honest lexical scoring: title > meta > body, prefix matches win. */
export function searchEntries(query: string, limit = 8): SearchEntry[] {
  const terms = tokenize(query);
  if (terms.length === 0) return [];
  const scored = searchIndex.map((entry) => {
    const title = entry.title.toLowerCase();
    const meta = (entry.meta ?? "").toLowerCase();
    const text = (entry.text ?? "").toLowerCase();
    let score = 0;
    for (const term of terms) {
      if (title.startsWith(term)) score += 5;
      else if (title.includes(term)) score += 4;
      if (meta.includes(term)) score += 2;
      if (text.includes(term)) score += 1;
    }
    return { entry, score };
  });
  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.entry);
}

export const searchIndexSize = searchIndex.length;
