/**
 * Data contract — every field from generation_02/CONTENT_PACK.md is preserved;
 * extensions are additive and marked. `sample: true` marks replaceable example
 * data: honest at the data layer, never rendered as a badge on module faces
 * (§4 / M4) — the one standing honesty declaration lives in the colophon.
 *
 * Cross-references (`topic`, `relatedDemo`, `demoRef`) are literal unions from
 * ./ids, so a bad reference fails `tsc` at compile time (§4 / D3).
 */
import type { DemoId, TopicId } from "./ids";

export interface Profile {
  name: string | null; // null = not provided; UI must degrade gracefully
  identity: string[]; // hero identity line
  about: string; // About paragraph (contains one CJK sentence on purpose)
  location: string | null;
}

export interface ResearchTopic {
  id: TopicId;
  name: string;
  short: string;
  blurb: string;
  order: number;
  /** extension — one-line facet shown in the hero; doubles as a palette query */
  facetLine?: string;
  /** extension — the researcher's own judgment of which fields adjoin which */
  adjoins: TopicId[];
  /** extension — a Lab instrument that demonstrates this direction */
  relatedDemo?: DemoId;
}

/** Low-maintenance status enum (§4): three states a human can actually keep
 *  honest. `updated: null` renders nothing — never an empty slot. */
export type QuestionStatus = "active" | "exploring" | "paused";

export interface ResearchQuestion {
  id: string;
  text: string;
  status: QuestionStatus;
  /** "YYYY-MM" or null. */
  updated: string | null;
  sample: boolean;
  /** extension — editorial tag into the topic whitelist */
  topic: TopicId;
  /** extension — a runnable Lab instrument that illustrates the question */
  relatedDemo?: DemoId;
  /** extension — notes that feed this question; the ledger↔note backlinks
   *  are derived from this field, never hand-linked in the pages (P1-17).
   *  Contract-checked at test time against the note ids. */
  relatedNotes?: string[];
}

export type ProjectKind = "research" | "tool" | "site" | "demo";

export interface ProjectLinks {
  github: string | null;
  demo: string | null;
  writeup: string | null;
}

export interface Project {
  id: string;
  title: string;
  summary: string;
  year: number;
  role: string;
  kind: ProjectKind;
  tags: string[];
  status: "active" | "maintained" | "archived" | null;
  links: ProjectLinks;
  featured: boolean;
  sample: boolean;
  /** extension — a Lab instrument that exists on this site */
  demoRef?: DemoId;
}

export interface Publication {
  id: string;
  title: string;
  authors: string[];
  venue: string;
  year: number;
  links: { pdf: string | null; code: string | null; doi: string | null };
}

/* ------------------------------- Notes ----------------------------------- */

export interface Note {
  id: string;
  title: string;
  date: string; // ISO
  kind: "note" | "paper-reading" | "engineering";
  summary: string;
  sample: boolean;
  /** extension — article body; a note without `body` renders list-only */
  body?: NoteBlock[];
}

export type NoteBlock =
  | { type: "p"; text: string; sidenote?: Sidenote }
  | { type: "h"; text: string }
  | { type: "code"; caption?: string; lang?: string; text: string };

export interface Sidenote {
  n: number;
  text: string;
}

export interface TimelineEntry {
  year: string;
  kind: "education" | "research" | "milestone" | "elsewhere";
  title: string;
  detail: string;
  sample: boolean;
}

export interface Links {
  email: string | null;
  github: string | null;
  scholar: string | null;
  orcid: string | null;
  linkedin: string | null;
  rss: string | null;
}

/* --------------------------- Lab contracts -------------------------------- */

export interface SandboxDoc {
  id: string;
  text: string;
  poisoned?: boolean;
}

/**
 * The toy defense is an honest heuristic: documents matching one of these
 * patterns have their BM25 score multiplied by `factor` BEFORE the ranking is
 * re-sorted (§4 / A1, D2). Labeled "toy heuristic, not a real defense"
 * everywhere it is rendered.
 */
export interface ToyDefense {
  label: string;
  patterns: RegExp[];
  factor: number;
}

export interface BudgetChunk {
  id: string;
  source: string;
  text: string;
}
