/**
 * Content contract — derived from CONTENT_PACK.md (Gen 2 shared spec).
 * Fields from the pack may be extended but never removed.
 * `sample: true` marks data the site owner will replace; the UI never
 * shows a "sample" badge — this is data-layer honesty only.
 */

export interface Profile {
  name: string | null; // null = 未提供，UI 需优雅处理
  identity: string[]; // 首屏身份行
  about: string; // About 段落
  location: string | null; // null = 隐藏
}

export interface ResearchTopic {
  id: string;
  name: string;
  short: string;
  blurb: string;
  order: number;
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
  /** Extended (allowed): an in-page cross-reference shown on the plate. */
  note?: string;
  noteHref?: string;
}

export interface Publication {
  id: string;
  title: string;
  authors: string[];
  venue: string;
  year: number;
  links: { pdf: string | null; code: string | null; doi: string | null };
} // 数据为空数组 → 触发空状态

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

/* ---- Lab ---- */

export interface SandboxDoc {
  id: string;
  text: string;
  poisoned?: boolean;
}

export interface LabDemoMeta {
  id: string;
  label: string;
  title: string;
  line: string;
}

/* ---- Site ---- */

export interface SiteContent {
  title: string;
  description: string;
  url: string;
  wordmark: string;
  heroTag: string;
  heroSans: string[];
  heroSerif: string;
  heroLedeFromAbout: true;
  connectIntro: string;
  connectEmptyLine: string;
  labIntro: string;
  labHonesty: string;
  colophonLegend: string;
  sample: boolean;
}

export interface Chapter {
  no: string;
  id: string;
  title: string;
  blurb: string;
}
