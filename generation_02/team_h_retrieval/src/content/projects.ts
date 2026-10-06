import type { ProjectWithChain } from "./types";

/**
 * From CONTENT_PACK §projects. The `chain` extension is derived strictly from
 * each `summary` — problem = what the summary says fails, method = what the
 * summary says was built, artifacts = only things that exist. Links are null
 * in the pack, so the LINKS station renders the honest "—" reading.
 */
export const projects: ProjectWithChain[] = [
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
    chain: {
      problem: "One corrupted passage can rewrite what retrieval calls evidence.",
      method: [
        "Score a hand-written corpus with lexical BM25",
        "Inject a poisoned document and watch the ranking flip",
        "Toggle a toy defense to compare both rankings",
      ],
      artifacts: ["The sandbox on this site’s Lab page"],
    },
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
    chain: {
      problem: "“The retriever returned something — but why these chunks, and were they even used?”",
      method: [
        "Inspect similarity at chunk level, not document level",
        "Trace retrieval scores back to their sources",
        "Compare retrieved evidence with what the generator used",
      ],
      artifacts: ["Chunk-level inspection tool (in maintenance)"],
    },
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
    chain: {
      problem: "Robustness checks fail quietly when they only run by hand.",
      method: [
        "Encode adversarial retrieval checks as CI rules",
        "Simulate noisy neighbors, conflicting sources, injected instructions",
      ],
      artifacts: ["A small CI harness (archived)"],
    },
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
    chain: {
      problem: "Can a personal archive stay honest and low-maintenance for years?",
      method: [
        "Type all content as TypeScript data contracts",
        "Render every section from src/content",
        "Declare what is sample and what is real",
      ],
      artifacts: ["This site"],
    },
  },
];
