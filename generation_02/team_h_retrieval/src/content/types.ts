/**
 * Content contract — the data-schema discipline (stolen from C, round 1).
 * Every field comes from ../CONTENT_PACK.md. Extensions are allowed; removals are not.
 * `sample: true` marks demo data. It is honest at the data layer and never
 * rendered as a badge at the UI layer — except where the brief demands
 * user-visible honesty (Publications empty state, Lab "illustrative" notes).
 */

export interface Profile {
  name: string | null; // null = not provided; UI must degrade gracefully
  identity: string[]; // hero identity lines
  about: string; // About paragraph (includes one CJK sentence on purpose)
  location: string | null; // null = hidden
}

export interface ResearchTopic {
  id: string;
  name: string;
  short: string;
  blurb: string;
  order: number;
  /** Gen-2 extension: the one-line facet shown in the hero self-query block. */
  facetLine?: string;
}

export type QuestionStatus = "active" | "open" | "resting";

export interface ResearchQuestion {
  id: string;
  text: string;
  status: QuestionStatus;
  updated: string | null;
  sample: boolean;
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
}

/** Gen-2 extension: the evidence-chain stations, derived from `summary` only. */
export interface EvidenceChain {
  problem: string; // one short question-shaped sentence (recruiter voice)
  method: string[]; // verb-first mono lines (researcher voice)
  artifacts: string[]; // only things that exist
}

export interface ProjectWithChain extends Project {
  chain: EvidenceChain;
}

export interface Publication {
  id: string;
  title: string;
  authors: string[];
  venue: string;
  year: number;
  links: { pdf: string | null; code: string | null; doi: string | null };
} // data is an empty array -> triggers the empty state

export interface Note {
  id: string;
  title: string;
  date: string; // ISO
  kind: "note" | "paper-reading" | "engineering";
  summary: string;
  sample: boolean;
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

/* ------------------------------ Lab contracts ------------------------------ */

export interface SandboxDoc {
  id: string;
  text: string;
  poisoned?: boolean;
}

/**
 * The toy defense is an honest heuristic: passages whose text matches one of
 * these patterns get their BM25 score multiplied by `factor`. It is labeled
 * "toy heuristic, not a real defense" wherever it is rendered.
 */
export interface ToyDefense {
  label: string;
  patterns: RegExp[];
  factor: number;
}

export interface BudgetChunk {
  id: string;
  text: string;
  /** chars/4 estimate, computed at render — never presented as a real count. */
  source: string;
}
