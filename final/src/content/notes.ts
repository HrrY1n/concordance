import type { Note } from "./types";

/**
 * CONTENT_PACK §notes, extended with article bodies (`body`) so /notes/:slug
 * can exercise the essay register: strict measure, numbered sidenotes (data-
 * driven, grid-anchored — §4 / D1), and code blocks that hold in both themes.
 * All three notes are sample data.
 */
export const notes = [
  {
    id: "n1",
    sample: true,
    date: "2026-08-14",
    kind: "paper-reading",
    title: "Poisoning is a retrieval problem before it is a model problem",
    summary:
      "Reading notes on why poisoned content mostly wins at the ranking stage, and why generation-side defenses start too late.",
    body: [
      {
        type: "p",
        text: "Most discussions of knowledge poisoning start at the model: the adversary smuggles a false claim past the guardrails and into the answer. But read the pipeline in order and a different picture appears. The poison does not need to persuade the model — it needs to persuade the ranker, and rankers are far easier to persuade.",
        sidenote: {
          n: 1,
          text: "By “the ranker” I mean whatever selects the context: lexical, dense, or a reranker on top. The argument survives all three; only the cost of persuasion changes.",
        },
      },
      {
        type: "p",
        text: "A lexical ranker counts. If the query asks about a topic, the passage that repeats that topic’s vocabulary wins. This is not a bug — term matching is why lexical retrieval is fast, predictable, and debuggable. But it means the winning move for an adversary is not cleverness; it is vocabulary.",
      },
      {
        type: "p",
        text: "The Corruption Sandbox on this site is a minimal demonstration: one hand-written passage stuffed with the query’s own terms takes the top slot from passages that genuinely answer the question. Nothing is hacked. The ranking did exactly what lexical scoring does.",
        sidenote: {
          n: 2,
          text: "Lab → Corruption Sandbox. The corpus is eight hand-written sentences; the query is fixed so the arithmetic stays checkable.",
        },
      },
      { type: "h", text: "Why generation-side defenses start too late" },
      {
        type: "p",
        text: "By the time a defense can inspect the generated answer, the poisoned passage has already been retrieved, quoted, and folded into the response. Attribution can tell you which passage a claim came from; it cannot tell you whether that passage earned its slot. Detection at the end of the pipeline inherits every error made upstream of it.",
      },
      {
        type: "p",
        text: "That is the summary of the reading so far: treat the corpus as an attack surface and the ranking as the bottleneck. The interesting questions move upstream — how little poisoning is enough, and whether instability of the ranking itself can be the detector.",
      },
    ],
  },
  {
    id: "n2",
    sample: true,
    date: "2026-06-02",
    kind: "note",
    title: "Evaluating robustness without a poisoned test set",
    summary:
      "An argument for perturbation-based evaluation: measure stability under corpus change instead of hunting specific attacks.",
    body: [
      {
        type: "p",
        text: "Robustness benchmarks usually work like vaccines: a curated set of known attacks, injected into a clean corpus, with a pass/fail threshold per attack. The approach assumes you can enumerate the attacks — but an adversary only needs one attack you didn’t enumerate.",
        sidenote: {
          n: 1,
          text: "The same critique applies to my own Sandbox: its toy defense pattern-matches known phrasings. It fails the moment the phrasing changes — which is the point of showing it.",
        },
      },
      {
        type: "p",
        text: "Perturbation-based evaluation asks a different question. Instead of did the system catch attack X, it asks: when the corpus changes, how much does the ranking change? A system whose top-k set is stable under small corpus perturbations is harder to steer with any single insertion, known or not.",
      },
      {
        type: "p",
        text: "The metric is cheap to compute — a rank correlation between before and after — and it degrades honestly: no oracle, no labeled attacks, no assumption that the adversary cooperates with the benchmark. What it measures is a property of the system, not of the attack.",
      },
      { type: "h", text: "What I am still unsure about" },
      {
        type: "p",
        text: "Stability is not the same as correctness. A system could be stable and wrong, or volatile and right. Whether ranking stability correlates with robustness against adaptive adversaries is exactly the kind of open question the ledger exists to keep visible.",
      },
    ],
  },
  {
    id: "n3",
    sample: true,
    date: "2026-04-19",
    kind: "engineering",
    title: "Chunk boundaries are policy decisions",
    summary:
      "What I learned building a small retrieval pipeline: chunking quietly encodes assumptions about what counts as one piece of evidence.",
    body: [
      {
        type: "p",
        text: "Every retrieval pipeline has a line of code that decides where one piece of evidence ends and the next begins. In my first pipeline it was a fixed 512-token window with a 50-token overlap, copied from a tutorial. It worked — which is the dangerous part, because it also decided things I never thought about.",
        sidenote: {
          n: 1,
          text: "Lab → Context Budget is the interactive version of this note: five chunks, one budget, and the order you choose decides what survives.",
        },
      },
      {
        type: "p",
        text: "A fixed window cuts claims in half at arbitrary points. A claim split across two chunks is weaker as evidence than a claim that arrived whole — the retriever sees two partial statements instead of one supported assertion. The window size is not a hyperparameter; it is an editorial stance about what counts as one thing.",
      },
      {
        type: "p",
        text: "The smallest honest fix I found: respect structure before counting tokens. Split on headings, paragraphs, and list items first; only fall back to the window when a unit is too large. The snippet below is the whole idea.",
      },
      {
        type: "code",
        lang: "ts",
        caption: "structure-first splitting, toy version",
        text: `function splitUnits(doc: string, max = 512): string[] {
  // 1. honor the author's own boundaries first
  const units = doc.split(/\\n{2,}/);
  // 2. only over-large units get windowed
  return units.flatMap((u) =>
    u.length <= max ? [u] : window(u, max, 50),
  );
}`,
      },
      {
        type: "p",
        text: "The lesson generalizes: chunking, ranking, and query formulation all silently shape what a model can say. None of them look like policy, and all of them are.",
      },
    ],
  },
] satisfies Note[];

export const noteById = (slug: string): Note | undefined =>
  notes.find((n) => n.id === slug);
