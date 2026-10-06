import type { ResearchQuestion, ResearchTopic } from "./types";

/** Six real research directions — CONTENT_PACK. `adjoins` is the
 * researcher's own judgment of adjacency (replaces the round-1 SVG map:
 * the relationship lives in typography and data, not in hand-placed nodes). */
export const researchTopics: ResearchTopic[] = [
  {
    id: "rag",
    order: 1,
    name: "Retrieval-Augmented Generation",
    short: "RAG",
    blurb:
      "Grounding language models in external evidence instead of parametric memory alone. I care about the full loop: what gets retrieved, how it conditions generation, and how errors propagate.",
    adjoins: ["robustness", "llm-systems", "retrieval-generation"],
  },
  {
    id: "robustness",
    order: 2,
    name: "RAG Robustness",
    short: "Robustness",
    blurb:
      "Real corpora are noisy, conflicting, and sometimes adversarial. I study how retrieval-grounded systems behave when the evidence is wrong, stale, or manipulated — and what “reliably grounded” should even mean.",
    adjoins: ["rag", "poisoning"],
  },
  {
    id: "poisoning",
    order: 3,
    name: "Knowledge Poisoning",
    short: "Poisoning",
    blurb:
      "A few adversarial documents in a corpus can steer retrieval and, through it, generation. I study the attack surface, how poisoned content travels through chunks and rankings, and defenses that don’t break normal use.",
    adjoins: ["robustness", "ai-security"],
  },
  {
    id: "ai-security",
    order: 4,
    name: "AI Security",
    short: "Security",
    blurb:
      "What happens when language systems meet adversaries: prompt injection, data poisoning, evaluation gaming — and the systems engineering that bounds the damage.",
    adjoins: ["poisoning"],
  },
  {
    id: "llm-systems",
    order: 5,
    name: "LLM / AI Systems",
    short: "Systems",
    blurb:
      "RAG is a systems problem as much as a modeling one: latency budgets, index freshness, evaluation pipelines, and the glue that keeps research code honest.",
    adjoins: ["rag", "robustness"],
  },
  {
    id: "retrieval-generation",
    order: 6,
    name: "Retrieval–Generation Interaction",
    short: "Retrieval × Generation",
    blurb:
      "Retrieval decisions are generation decisions. Chunking, ranking, and query formulation silently shape what a model can say; I study that interaction directly.",
    adjoins: ["rag"],
  },
];

/** The Question Ledger — CONTENT_PACK. Extensions: `topic` (editorial tag
 * driving derived counts and filtering) and `relatedDemo` (a runnable
 * instrument that illustrates the question). `updated: null` renders nothing. */
export const researchQuestions: ResearchQuestion[] = [
  {
    id: "q1",
    sample: true,
    status: "active",
    updated: "2026-09",
    topic: "poisoning",
    relatedDemo: "corruption-sandbox",
    text:
      "How little poisoned content does it take to change a retrieval ranking — and can the change be detected from ranking instability alone?",
  },
  {
    id: "q2",
    sample: true,
    status: "open",
    updated: "2026-08",
    topic: "poisoning",
    relatedDemo: "corruption-sandbox",
    text:
      "Which defense — corpus filtering, consistency checks, or generation-side attribution — fails least quietly?",
  },
  {
    id: "q3",
    sample: true,
    status: "open",
    updated: null,
    topic: "robustness",
    text:
      "Do robustness gains measured on one corpus distribution transfer to another?",
  },
  {
    id: "q4",
    sample: true,
    status: "resting",
    updated: "2026-05",
    topic: "robustness",
    text:
      "What should an evaluation suite for retrieval robustness measure that current benchmarks don’t?",
  },
];
