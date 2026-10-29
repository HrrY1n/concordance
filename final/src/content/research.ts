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
 *  low-maintenance enum (active / exploring / paused).
 *
 *  Real Content & Cases pass: the four sample questions were REMOVED, not
 *  promoted — research directions above are the real, public part of the
 *  picture; questions enter the ledger only when there is committed work
 *  behind them. An empty ledger is the honest state, and the pages render
 *  it as one. */
export const researchQuestions: ResearchQuestion[] = [];
