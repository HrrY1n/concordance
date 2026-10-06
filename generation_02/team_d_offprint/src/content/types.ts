/**
 * Data contract — every field from generation_02/CONTENT_PACK.md is preserved.
 * Extensions are additive only (marked with "extension" comments).
 * `sample: true` marks replaceable example data (data-layer honesty only,
 * never rendered as a badge).
 */

export interface Profile {
  name: string | null; // null = not provided, UI must degrade gracefully
  identity: string[]; // hero identity line
  about: string;
  location: string | null;
}

/** extension — hero copy composed from the profile's own material (no new claims) */
export interface HeroContent {
  edition: string;
  stance: string;
  lede: string;
  contactNote: string;
}

export interface ResearchTopic {
  id: string;
  name: string;
  short: string;
  blurb: string;
  order: number;
  /** extension — the researcher's own judgment of which fields adjoin which */
  adjoins: string[];
}

export type QuestionStatus = "active" | "open" | "resting";

export interface ResearchQuestion {
  id: string;
  text: string;
  status: QuestionStatus;
  /** ISO-ish "YYYY-MM" or null. null renders NOTHING — never an empty slot. */
  updated: string | null;
  sample: boolean;
  /** extension — editorial tagging, drives derived counts + ledger filtering */
  topic: string;
  /** extension — link a question to a runnable Lab instrument that illustrates it */
  relatedDemo?: string;
}

export type ProjectKind = "research" | "tool" | "site" | "demo";

export interface Project {
  id: string;
  title: string;
  summary: string;
  year: number;
  role: string;
  kind: ProjectKind;
  tags: string[];
  status: "active" | "maintained" | "archived" | null;
  links: { github: string | null; demo: string | null; writeup: string | null };
  featured: boolean;
  sample: boolean;
  /** extension — points at a Lab instrument that really exists on this site */
  demoRef?: string;
  /** extension — one honest in-page action for entries whose external links are null */
  inPageAction?: { label: string; to: string };
}

export interface Publication {
  id: string;
  title: string;
  authors: string[];
  venue: string;
  year: number;
  links: { pdf: string | null; code: string | null; doi: string | null };
}

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

/* ---------- Lab: Corruption Sandbox (CONTENT_PACK §demo) ---------- */

export interface SandboxDoc {
  id: string;
  text: string;
  poisoned?: boolean;
}

export interface LabInstrument {
  id: string;
  index: string; // "X-01"
  title: string;
  blurb: string;
  method: string;
  runtime: string;
  reQuestions: string[]; // question ids it illustrates
  path: string;
}
