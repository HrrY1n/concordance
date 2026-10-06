/**
 * The palette's local index — built from the content modules (E's idea,
 * auto-inherited). Scoring is deliberately simple and explainable:
 * coordinate hit > title prefix > title substring > hint substring > tag hit.
 * Footer reading: "LOCAL INDEX · N RECORDS · 0MS NETWORK" — all three claims
 * are true by construction.
 */
import { links } from "@/content/publications";
import { budgetChunks, sandboxCorpus } from "@/content/lab";
import { notes } from "@/content/publications";
import { projects } from "@/content/projects";
import { researchQuestions, researchTopics } from "@/content/research";
import { sections } from "@/lib/sections";

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
    title: "Home — the resolved index",
    hint: "The self-query block and the whole corpus in one scroll",
    coord: "§00",
    route: "/",
    keywords: ["home", "hero", "index", "who is this"],
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
      coord: `§02 · W-0${i + 1}`,
      route: "/work",
      keywords: [...p.tags.map((t) => t.toLowerCase()), p.kind, String(p.year)],
    });
  });

  researchTopics.forEach((t) => {
    records.push({
      id: `topic-${t.id}`,
      type: "TOPIC",
      title: t.name,
      hint: t.blurb,
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
      route: "/notes",
      keywords: [n.kind, n.date],
    });
  });

  records.push({
    id: "demo-sandbox",
    type: "DEMO",
    title: "Corruption Sandbox",
    hint: "Inject a poisoned document, watch a ranking flip, toggle a toy defense",
    coord: "§03",
    route: "/lab",
    keywords: ["poisoning", "bm25", "sandbox", "corruption", "ranking"],
  });
  records.push({
    id: "demo-budget",
    type: "DEMO",
    title: "Context Budget",
    hint: "Token budget vs. chunk order — why reranking matters",
    coord: "§03",
    route: "/lab",
    keywords: ["chunking", "context", "reranking", "budget", "truncation"],
  });

  records.push(
    {
      id: "action-theme",
      type: "ACTION",
      title: "Toggle color scheme",
      hint: "System → light → dark",
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

  // Honest index: channels that exist are indexed; null channels are not.
  if (links.email) {
    records.push({
      id: "link-email",
      type: "PAGE",
      title: `Write to ${links.email}`,
      hint: "Contact",
      coord: "§06",
      route: "/about",
      keywords: ["email", "contact", "write"],
    });
  }

  return records;
}

export function indexSize(): string {
  const n = buildIndex().length + sandboxCorpus.length + budgetChunks.length;
  return `${n}`;
}

export function queryRecords(records: SearchRecord[], rawQuery: string): SearchRecord[] {
  const q = rawQuery.trim().toLowerCase();
  if (!q) {
    // Empty query: pages and actions first — the palette doubles as a menu.
    const pages = records.filter((r) => r.type === "PAGE" || r.type === "ACTION");
    const rest = records.filter((r) => r.type !== "PAGE" && r.type !== "ACTION");
    return [...pages, ...rest].slice(0, 8);
  }
  const terms = q.split(/\s+/);
  const scored = records
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
    .sort((a, z) => z.score - a.score);
  return scored.slice(0, 8).map((x) => x.r);
}
