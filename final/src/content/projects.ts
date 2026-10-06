import type { Project } from "./types";

/** CONTENT_PACK §projects — four entries, p4 (this site) is the only real one. */
export const projects = [
  {
    id: "poison-sandbox",
    sample: true,
    featured: true,
    year: 2026,
    kind: "tool",
    title: "Poison Sandbox",
    summary:
      "A local sandbox that shows how a single corrupted passage rewrites a retrieval ranking — built to make the failure mode visible, not to claim a defense.",
    role: "Solo",
    status: "active",
    tags: ["RAG", "Robustness", "Visualization"],
    links: { github: null, demo: null, writeup: null },
    demoRef: "corruption-sandbox",
  },
  {
    id: "retrieval-lens",
    sample: true,
    featured: true,
    year: 2025,
    kind: "tool",
    title: "Retrieval Lens",
    summary:
      "Chunk-level similarity inspection for RAG debugging: which chunks were retrieved, why they scored, and what the generator actually used.",
    role: "Solo",
    status: "maintained",
    tags: ["RAG", "Tooling"],
    links: { github: null, demo: null, writeup: null },
  },
  {
    id: "robust-eval-kit",
    sample: true,
    featured: false,
    year: 2025,
    kind: "tool",
    title: "robust-eval-kit",
    summary:
      "A small harness of adversarial retrieval checks that runs in CI: noisy neighbors, conflicting sources, injected instructions.",
    role: "Solo",
    status: "archived",
    tags: ["Robustness", "Evaluation"],
    links: { github: null, demo: null, writeup: null },
  },
  {
    id: "this-site",
    sample: false,
    featured: true,
    year: 2026,
    kind: "site",
    title: "This site",
    summary:
      "A data-driven personal archive: content as typed TypeScript, designed to grow for years without a redesign.",
    role: "Designer & engineer",
    status: "active",
    tags: ["TypeScript", "Design Systems"],
    links: { github: null, demo: null, writeup: null },
  },
] satisfies Project[];

/** extension — evidence chains for the PLATE grammar. `Record<ProjectId, …>`
 *  makes a missing chain a COMPILE ERROR: add a project, and tsc demands its
 *  evidence chain too (§4 / D3). */
export type ProjectId = (typeof projects)[number]["id"];

export interface EvidenceChain {
  problem: string; // one question-shaped sentence
  method: string[]; // verb-first mono lines
  artifacts: string[]; // only things that exist
}

export const chains: Record<ProjectId, EvidenceChain> = {
  "poison-sandbox": {
    problem: "What does one corrupted passage do to a retrieval ranking?",
    method: [
      "hand-write an 8-document corpus",
      "score it with bm25 (k1 1.5, b 0.75)",
      "inject d8, re-rank, watch the top slot flip",
      "multiply matched scores ×0.1 and re-rank again",
    ],
    artifacts: [
      "Corruption Sandbox — live on this site",
      "2 acceptance invariants, tested in vitest",
    ],
  },
  "retrieval-lens": {
    problem: "Which chunks were retrieved, why did they score, and what did the generator use?",
    method: [
      "log retriever input and output per query",
      "inspect chunk scores against the query terms",
      "diff retrieved set against the generator's citations",
    ],
    artifacts: ["inspection notebooks (private) — no public release yet"],
  },
  "robust-eval-kit": {
    problem: "Can adversarial retrieval checks run where the code already runs — in CI?",
    method: [
      "encode noisy-neighbor and conflicting-source checks",
      "inject instruction-style passages into test corpora",
      "fail the build on ranking instability",
    ],
    artifacts: ["local harness runs — archived, superseded by the perturbation approach"],
  },
  "this-site": {
    problem: "Can a personal archive grow for years without a redesign?",
    method: [
      "type the content, not the pages",
      "derive every reading from the data files",
      "compute every figure in the visitor's browser",
    ],
    artifacts: [
      "this site",
      "content contract in src/content/*.ts",
      "engine tests in src/lib/__tests__/",
    ],
  },
};
