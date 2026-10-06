/**
 * The palette's local index — the concordance proper. Two layers:
 *
 * 1. RECORDS — the catalog: pages, projects, topics, questions, notes, demos
 *    and actions, each citing its § coordinate. Scoring is deliberately
 *    simple and explainable: coordinate hit > title prefix > title substring
 *    > haystack substring > all-terms fallback.
 * 2. PASSAGES — the quotation layer that makes this an actual concordance
 *    (P2-20): note bodies, the sandbox corpus and the budget chunks are
 *    split into sentences and ranked with the site's own bm25Rank. A hit
 *    renders as a KWIC citation line (key word in context) with its
 *    coordinate — every word's every occurrence, quotable.
 *
 * The footer reading ("LOCAL INDEX · N RECORDS · 0MS NETWORK") is true by
 * construction. This footer line is the one standing "0ms network" on the
 * site — figures vary the phrasing, the promise is stated once.
 */
import { DEMO_REGISTRY } from "@/content/ids";
import { budgetChunks, sandboxCorpus } from "@/content/lab";
import { notes } from "@/content/notes";
import { projects } from "@/content/projects";
import { researchQuestions, researchTopics } from "@/content/research";
import { sections } from "@/lib/sections";
import { bm25Rank, tokenize } from "@/lib/bm25";

export type RecordType = "PAGE" | "PROJECT" | "TOPIC" | "QUESTION" | "NOTE" | "DEMO" | "ACTION";

export interface SearchRecord {
  id: string;
  type: RecordType;
  title: string;
  hint: string;
  coord: string;
  route: string;
  /** For ACTION records, handled by the palette instead of routing. */
  action?: "theme" | "top";
  keywords: string[];
}

export function buildIndex(): SearchRecord[] {
  const records: SearchRecord[] = [];

  records.push({
    id: "page-home",
    type: "PAGE",
    title: "Home — frontispiece",
    hint: "The whole archive in one scroll, with live figures",
    coord: "§00",
    route: "/",
    keywords: ["home", "hero", "frontispiece", "who is this"],
  });

  for (const s of sections) {
    records.push({
      id: `page-${s.id}`,
      type: "PAGE",
      title: s.title,
      hint: s.kicker,
      coord: `§${s.num}`,
      route: s.route,
      keywords: [s.id, s.title.toLowerCase()],
    });
  }

  projects.forEach((p, i) => {
    records.push({
      id: `project-${p.id}`,
      type: "PROJECT",
      title: p.title,
      hint: p.summary,
      coord: `§02 · PLATE ${String(i + 1).padStart(2, "0")}`,
      route: "/work",
      keywords: [...p.tags.map((t) => t.toLowerCase()), p.kind, String(p.year)],
    });
  });

  researchTopics.forEach((t) => {
    records.push({
      id: `topic-${t.id}`,
      type: "TOPIC",
      title: t.name,
      hint: t.facetLine ?? t.blurb,
      coord: "§01",
      route: "/research",
      keywords: [t.short.toLowerCase(), t.id],
    });
  });

  researchQuestions.forEach((q) => {
    records.push({
      id: `question-${q.id}`,
      type: "QUESTION",
      title: q.text,
      hint: `Question ledger — status: ${q.status}`,
      coord: "§01",
      route: "/research",
      keywords: [q.id, q.status],
    });
  });

  notes.forEach((n) => {
    records.push({
      id: `note-${n.id}`,
      type: "NOTE",
      title: n.title,
      hint: n.summary,
      coord: "§04",
      route: `/notes/${n.id}`,
      keywords: [n.kind, n.date],
    });
  });

  for (const demo of Object.values(DEMO_REGISTRY)) {
    records.push({
      id: `demo-${demo.id}`,
      type: "DEMO",
      title: demo.title,
      hint: demo.blurb,
      coord: "§03",
      route: demo.route,
      keywords: [demo.id.replace(/-/g, " "), demo.method.toLowerCase()],
    });
  }

  records.push(
    {
      id: "action-theme",
      type: "ACTION",
      title: "Re-ink the page",
      hint: "Color scheme: system → light → dark",
      coord: "ACTION",
      route: "",
      action: "theme",
      keywords: ["theme", "dark", "light", "scheme"],
    },
    {
      id: "action-top",
      type: "ACTION",
      title: "Back to top",
      hint: "Scroll to §00",
      coord: "ACTION",
      route: "",
      action: "top",
      keywords: ["top", "scroll", "up"],
    },
  );

  return records;
}

/* ------------------------------ passages ---------------------------------- */

export interface Passage {
  id: string;
  /** One sentence of the corpus. */
  text: string;
  /** The containing document, for the citation row. */
  title: string;
  coord: string;
  route: string;
}

const SENTENCE_SPLIT = /(?<=[.!?])\s+/;

/** Note bodies, the sandbox corpus and the budget chunks, sentence by sentence. */
export function buildPassages(): Passage[] {
  const passages: Passage[] = [];

  for (const n of notes) {
    const blocks = n.body ?? [];
    blocks.forEach((block, bi) => {
      const sentences =
        block.type === "code"
          ? [] // code is quotable through its note, not as prose
          : block.text.split(SENTENCE_SPLIT);
      sentences.forEach((sentence, si) => {
        if (sentence.trim().length < 12) return;
        passages.push({
          id: `passage-${n.id}-${bi}-${si}`,
          text: sentence.trim(),
          title: n.title,
          coord: `§04 · ${n.date}`,
          route: `/notes/${n.id}`,
        });
      });
    });
  }

  for (const doc of sandboxCorpus) {
    doc.text.split(SENTENCE_SPLIT).forEach((sentence, si) => {
      passages.push({
        id: `passage-sandbox-${doc.id}-${si}`,
        text: sentence.trim(),
        title: `Corruption Sandbox — ${doc.id}${doc.poisoned ? " (poisoned)" : ""}`,
        coord: "§03 · L-01",
        route: "/lab/corruption-sandbox",
      });
    });
  }

  for (const chunk of budgetChunks) {
    chunk.text.split(SENTENCE_SPLIT).forEach((sentence, si) => {
      passages.push({
        id: `passage-budget-${chunk.id}-${si}`,
        text: sentence.trim(),
        title: `Context Budget — ${chunk.id}`,
        coord: "§03 · L-02",
        route: "/lab",
      });
    });
  }

  return passages;
}

export interface KwicHit extends Passage {
  score: number;
  matchStart: number;
  matchLength: number;
}

/**
 * KWIC window: bounded left context (kept whole — the citation may not lose
 * its nearest words), the matched term, bounded right context. The component
 * renders `<mark>` around `match`.
 */
export function kwicWindow(
  text: string,
  start: number,
  length: number,
  leftRadius = 28,
  rightRadius = 72,
): { left: string; match: string; right: string } {
  const leftStart = Math.max(0, start - leftRadius);
  const rightEnd = Math.min(text.length, start + length + rightRadius);
  return {
    left: `${leftStart > 0 ? "… " : ""}${text.slice(leftStart, start)}`,
    match: text.slice(start, start + length),
    right: `${text.slice(start + length, rightEnd)}${rightEnd < text.length ? " …" : ""}`,
  };
}

/** Rank passages with the shipped BM25 and locate the first term hit. */
export function queryPassages(passages: Passage[], rawQuery: string): KwicHit[] {
  const q = rawQuery.trim();
  if (!q) return [];
  const ranked = bm25Rank(passages, q).filter((hit) => hit.score > 0);
  const terms = [...tokenize(q)].sort((a, z) => z.length - a.length);
  const hits: KwicHit[] = [];
  for (const hit of ranked) {
    const passage = passages.find((p) => p.id === hit.id);
    if (!passage) continue;
    const lower = passage.text.toLowerCase();
    let matchStart = -1;
    let matchLength = 0;
    for (const term of terms) {
      const at = lower.indexOf(term);
      if (at !== -1 && (matchStart === -1 || at < matchStart)) {
        matchStart = at;
        matchLength = term.length;
      }
    }
    if (matchStart === -1) continue; // tokenizer disagreement — no KWIC line
    hits.push({ ...passage, score: hit.score, matchStart, matchLength });
    if (hits.length >= 3) break;
  }
  return hits;
}

/* ------------------------------- queries ---------------------------------- */

export const PALETTE_MAX_RESULTS = 8;

/**
 * Full ranked list — truncation is a presentation decision, not a scoring
 * one (P0-9: the empty-query menu used to slice away its own actions).
 */
export function queryRecords(records: SearchRecord[], rawQuery: string): SearchRecord[] {
  const q = rawQuery.trim().toLowerCase();
  if (!q) {
    // Empty query: pages and actions first — the palette doubles as a menu.
    const pages = records.filter((r) => r.type === "PAGE" || r.type === "ACTION");
    const rest = records.filter((r) => r.type !== "PAGE" && r.type !== "ACTION");
    return [...pages, ...rest];
  }
  const terms = q.split(/\s+/);
  return records
    .map((r) => {
      const haystack = `${r.title} ${r.hint} ${r.keywords.join(" ")}`.toLowerCase();
      let score = 0;
      if (r.coord.toLowerCase() === q) score += 80;
      if (r.title.toLowerCase().startsWith(q)) score += 100;
      else if (r.title.toLowerCase().includes(q)) score += 60;
      else if (haystack.includes(q)) score += 30;
      // every term must land somewhere
      const allTerms = terms.every((t) => haystack.includes(t));
      if (allTerms && score === 0) score = 20;
      return { r, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, z) => z.score - a.score)
    .map((x) => x.r);
}

export interface PaletteSelection {
  shown: SearchRecord[];
  totalMatches: number;
  truncated: boolean;
}

/**
 * Presentation cap: content records stop at PALETTE_MAX_RESULTS; ACTION rows
 * always survive (the empty-query menu must keep "Back to top"), and the
 * truncation is reported instead of being silent (P0-9).
 */
export function selectResults(ranked: SearchRecord[]): PaletteSelection {
  const actions = ranked.filter((r) => r.action);
  const content = ranked.filter((r) => !r.action);
  const shownContent = content.slice(0, PALETTE_MAX_RESULTS);
  return {
    shown: [...shownContent, ...actions],
    totalMatches: content.length,
    truncated: content.length > shownContent.length,
  };
}

export function indexSize(): string {
  return `${buildIndex().length + buildPassages().length}`;
}
