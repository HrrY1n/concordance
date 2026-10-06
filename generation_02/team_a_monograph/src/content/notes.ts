import type { Note } from "./types";

export const notes: Note[] = [
  {
    id: "n1",
    sample: true,
    date: "2026-08-14",
    kind: "paper-reading",
    title: "Poisoning is a retrieval problem before it is a model problem",
    summary:
      "Reading notes on why poisoned content mostly wins at the ranking stage, and why generation-side defenses start too late.",
  },
  {
    id: "n2",
    sample: true,
    date: "2026-06-02",
    kind: "note",
    title: "Evaluating robustness without a poisoned test set",
    summary:
      "An argument for perturbation-based evaluation: measure stability under corpus change instead of hunting specific attacks.",
  },
  {
    id: "n3",
    sample: true,
    date: "2026-04-19",
    kind: "engineering",
    title: "Chunk boundaries are policy decisions",
    summary:
      "What I learned building a small retrieval pipeline: chunking quietly encodes assumptions about what counts as one piece of evidence.",
  },
];
