/**
 * The engine — a small, honest BM25 (k1 = 1.5, b = 0.75) plus a raw TF·IDF
 * for comparison. Pure functions, zero dependencies, zero network: the same
 * numbers the Lab renders are the numbers the tests assert
 * (src/lib/__tests__/bm25.test.ts, sandbox-acceptance.test.ts).
 *
 * Defense semantics (§4 / A1, D2 — the A-bug fix): a matched document's score
 * is multiplied by the toy factor BEFORE the list is re-sorted, so the top-5
 * is always taken from the post-defense ranking — never a stale order.
 */

const STOPWORDS = new Set([
  "a", "an", "the", "to", "of", "in", "on", "for", "is", "are", "was", "were", "be", "been",
  "and", "or", "but", "if", "then", "that", "this", "these", "those", "it", "its", "as",
  "by", "with", "from", "at", "into", "about", "over", "after", "before", "can", "could",
  "how", "what", "why", "when", "where", "which", "who", "whom", "do", "does", "did",
  "not", "no", "yes", "any", "every", "each", "all", "some", "such", "s", "t",
]);

/** Lowercase, split on non-letters, strip possessives, drop stopwords. */
export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/['’]s\b/g, "")
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length > 1 && !STOPWORDS.has(w));
}

export interface ScoredDoc {
  id: string;
  score: number;
  poisoned: boolean;
}

export interface RankOptions {
  /** Multiply the score of documents whose text matches a toy-defense pattern. */
  defense?: { patterns: RegExp[]; factor: number } | null;
}

interface Corpus {
  id: string;
  text: string;
  poisoned?: boolean;
}

/** BM25Okapi with the classic parameters. Deterministic, in memory. */
export function bm25Rank(
  corpus: readonly Corpus[],
  query: string,
  options: RankOptions = {},
): ScoredDoc[] {
  const k1 = 1.5;
  const b = 0.75;

  const docTokens = corpus.map((d) => tokenize(d.text));
  const docLen = docTokens.map((tokens) => tokens.length);
  const avgdl = docLen.reduce((sum, len) => sum + len, 0) / (docLen.length || 1);

  const df = new Map<string, number>();
  for (const tokens of docTokens) {
    const seen = new Set(tokens);
    for (const term of seen) df.set(term, (df.get(term) ?? 0) + 1);
  }

  const N = corpus.length;
  const idf = (term: string): number => {
    const n = df.get(term) ?? 0;
    return Math.log((N - n + 0.5) / (n + 0.5) + 1);
  };

  const queryTerms = [...new Set(tokenize(query))];

  const scored: ScoredDoc[] = corpus.map((doc, i) => {
    let score = 0;
    for (const term of queryTerms) {
      const tf = docTokens[i].reduce((count, t) => (t === term ? count + 1 : count), 0);
      if (tf === 0) continue;
      const norm = tf + k1 * (1 - b + b * (docLen[i] / (avgdl || 1)));
      score += idf(term) * ((tf * (k1 + 1)) / norm);
    }
    if (options.defense && options.defense.patterns.some((p) => p.test(doc.text))) {
      score *= options.defense.factor;
    }
    return { id: doc.id, score, poisoned: doc.poisoned === true };
  });

  return scored.sort((a, z) => z.score - a.score);
}

/**
 * Raw TF·IDF: tf × ln(N / df), no length normalization, no saturation. Used
 * by the "Rankers, Side by Side" demo — its disagreements with BM25 above are
 * exactly the effect of length normalization, which is the lesson.
 */
export function tfidfRank(corpus: readonly Corpus[], query: string): ScoredDoc[] {
  const docTokens = corpus.map((d) => tokenize(d.text));
  const N = corpus.length;

  const df = new Map<string, number>();
  for (const tokens of docTokens) {
    const seen = new Set(tokens);
    for (const term of seen) df.set(term, (df.get(term) ?? 0) + 1);
  }

  const queryTerms = [...new Set(tokenize(query))];

  const scored: ScoredDoc[] = corpus.map((doc, i) => {
    let score = 0;
    for (const term of queryTerms) {
      const tf = docTokens[i].reduce((count, t) => (t === term ? count + 1 : count), 0);
      if (tf === 0) continue;
      const n = df.get(term) ?? 0;
      if (n === 0) continue;
      score += tf * Math.log(N / n);
    }
    return { id: doc.id, score, poisoned: doc.poisoned === true };
  });

  return scored.sort((a, z) => z.score - a.score);
}

/**
 * Rank deltas (the ▲▼ arrows) between two rankings of the same corpus.
 * Positive = climbed since the previous state; omitted for newcomers.
 */
export function rankDeltas(
  previous: readonly ScoredDoc[],
  current: readonly ScoredDoc[],
): Map<string, number> {
  const prevRank = new Map(previous.map((d, i) => [d.id, i + 1]));
  const deltas = new Map<string, number>();
  current.forEach((d, i) => {
    const prev = prevRank.get(d.id);
    if (prev !== undefined && prev !== i + 1) deltas.set(d.id, prev - (i + 1));
  });
  return deltas;
}
