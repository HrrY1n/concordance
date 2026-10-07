import type { ResearchQuestion, ResearchTopic } from "./types";

/** CONTENT_PACK §researchTopics — six real directions. `adjoins` and
 *  `relatedDemo` are researcher-curated cross-references; both are type-checked
 *  against the literal unions in ./ids (a typo fails the build). */
export const researchTopics = [
  {
    id: "rag",
    order: 1,
    name: "Retrieval-Augmented Generation",
    short: "RAG",
    blurb:
      "Grounding language models in external evidence instead of parametric memory alone. The full loop matters: what gets retrieved, how it conditions generation, and how errors propagate.",
    facetLine: "What gets retrieved decides what can be said.",
    adjoins: ["robustness", "llm-systems", "retrieval-generation"],
  },
  {
    id: "robustness",
    order: 2,
    name: "RAG Robustness",
    short: "Robustness",
    blurb:
      "Real corpora are noisy, conflicting, and sometimes adversarial. The open question is how retrieval-grounded systems behave when the evidence is wrong, stale, or manipulated — and what “reliably grounded” should even mean.",
    facetLine: "Grounded in evidence, until the evidence turns.",
    adjoins: ["rag", "poisoning"],
    relatedDemo: "rankers-side-by-side",
  },
  {
    id: "poisoning",
    order: 3,
    name: "Knowledge Poisoning",
    short: "Poisoning",
    blurb:
      "A few adversarial documents in a corpus can steer retrieval and, through it, generation. The attack surface runs through chunks and rankings, and defenses have to survive normal use.",
    facetLine: "Whoever writes the corpus writes the ranking.",
    adjoins: ["robustness", "ai-security"],
    relatedDemo: "corruption-sandbox",
  },
  {
    id: "ai-security",
    order: 4,
    name: "AI Security",
    short: "Security",
    blurb:
      "What happens when language systems meet adversaries: prompt injection, data poisoning, evaluation gaming — and the systems engineering that bounds the damage.",
    facetLine: "Bounded damage is a systems property.",
    adjoins: ["poisoning"],
  },
  {
    id: "llm-systems",
    order: 5,
    name: "LLM / AI Systems",
    short: "Systems",
    blurb:
      "RAG is a systems problem as much as a modeling one: latency budgets, index freshness, evaluation pipelines, and the glue that keeps research code honest.",
    facetLine: "Research code stays honest in pipelines, not papers.",
    adjoins: ["rag", "robustness"],
    relatedDemo: "context-budget",
  },
  {
    id: "retrieval-generation",
    order: 6,
    name: "Retrieval–Generation Interaction",
    short: "Retrieval × Generation",
    blurb:
      "Retrieval decisions are generation decisions. Chunking, ranking, and query formulation silently shape what a model can say; the interaction is studied directly, at the level of the pipeline.",
    facetLine: "Chunk boundaries are policy decisions.",
    adjoins: ["rag"],
  },
] satisfies ResearchTopic[];

/** CONTENT_PACK §researchQuestions — the Question Ledger. Statuses use the
 *  low-maintenance enum (active / exploring / paused). */
export const researchQuestions = [
  {
    id: "q1",
    sample: true,
    status: "active",
    updated: "2026-09",
    topic: "poisoning",
    relatedDemo: "corruption-sandbox",
    relatedNotes: ["n1"],
    text: "How little poisoned content does it take to change a retrieval ranking — and can the change be detected from ranking instability alone?",
  },
  {
    id: "q2",
    sample: true,
    status: "active",
    updated: "2026-08",
    topic: "poisoning",
    relatedDemo: "corruption-sandbox",
    relatedNotes: ["n1"],
    text: "Which defense — corpus filtering, consistency checks, or generation-side attribution — fails least quietly?",
  },
  {
    id: "q3",
    sample: true,
    status: "exploring",
    updated: null,
    topic: "robustness",
    relatedNotes: ["n2"],
    text: "Do robustness gains measured on one corpus distribution transfer to another?",
  },
  {
    id: "q4",
    sample: true,
    status: "paused",
    updated: "2026-05",
    topic: "robustness",
    relatedNotes: ["n2"],
    text: "What should an evaluation suite for retrieval robustness measure that current benchmarks don’t?",
  },
] satisfies ResearchQuestion[];
