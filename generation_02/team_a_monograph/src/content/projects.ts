import type { Project } from "./types";

export const projects: Project[] = [
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
    note: "Open the instrument in the Lab ↘",
    noteHref: "#lab",
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
    note: "You are looking at it.",
  },
];
