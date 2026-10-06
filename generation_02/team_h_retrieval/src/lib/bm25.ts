/**
 * A small, honest BM25 (k1 = 1.5, b = 0.75) — the Corruption Sandbox engine.
 * Pure functions, zero dependencies, zero network. Also loaded by
 * scripts/verify-sandbox.mjs through vite's ssrLoadModule for acceptance.
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
}

export interface RankOptions {
  /** Multiply the score of docs whose text matches the toy-defense patterns. */
  defense?: { patterns: RegExp[]; factor: number } | null;
}

export function bm25Rank(
  corpus: ReadonlyArray<{ id: string; text: string }>,
  query: string,
  options: RankOptions = {},
): ScoredDoc[] {
  const k1 = 1.5;
  const b = 0.75;

  const docTokens = corpus.map((d) => tokenize(d.text));
  const docLen = docTokens.map((tokens) => tokens.length);
  const avgdl = docLen.reduce((sum, len) => sum + len, 0) / (docLen.length || 1);

  // document frequency per term
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

  const termFreq = (tokens: string[], term: string): number =>
    tokens.reduce((count, t) => (t === term ? count + 1 : count), 0);

  const queryTerms = tokenize(query);
  const uniqueTerms = [...new Set(queryTerms)];

  const scored: ScoredDoc[] = corpus.map((doc, i) => {
    let score = 0;
    for (const term of uniqueTerms) {
      const tf = termFreq(docTokens[i], term);
      if (tf === 0) continue;
      const norm = tf + k1 * (1 - b + b * (docLen[i] / (avgdl || 1)));
      score += idf(term) * ((tf * (k1 + 1)) / norm);
    }
    if (options.defense && options.defense.patterns.some((p) => p.test(doc.text))) {
      score *= options.defense.factor;
    }
    return { id: doc.id, score };
  });

  return scored.sort((a, z) => z.score - a.score);
}
