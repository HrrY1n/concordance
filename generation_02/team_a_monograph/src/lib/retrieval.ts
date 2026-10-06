/**
 * Toy retrieval core — pure functions, no dependencies, deterministic.
 * Shared by the Corruption Sandbox (Lab), the Chunk Boundaries demo and the
 * live figure on the Work plate. Everything shown on screen is computed here,
 * in the visitor's browser — no fabricated numbers.
 */

const STOPWORDS = new Set([
  "a", "an", "the", "and", "or", "but", "if", "then", "than", "so", "as",
  "at", "by", "for", "in", "of", "on", "to", "up", "with", "from", "into",
  "over", "under", "about", "against", "between", "through", "during",
  "before", "after", "above", "below", "is", "are", "was", "were", "be",
  "been", "being", "it", "its", "this", "that", "these", "those", "there",
  "here", "can", "could", "should", "would", "may", "might", "must", "will",
  "shall", "do", "does", "did", "how", "what", "when", "where", "which",
  "who", "whom", "why", "not", "no", "nor", "only", "own", "same", "too",
  "very", "just", "also", "any", "all", "each", "every", "some", "such",
  "more", "most", "other", "i", "you", "he", "she", "we", "they", "them",
  "their", "his", "her", "our", "your", "my", "me", "us", "because",
]);

/** Crude suffix-s stemming — enough for a toy; documented as such. */
export function stem(word: string): string {
  if (word.length > 4 && word.endsWith("ies")) return `${word.slice(0, -3)}y`;
  if (word.length > 3 && word.endsWith("s") && !word.endsWith("ss") && !word.endsWith("us")) {
    return word.slice(0, -1);
  }
  return word;
}

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length > 1 && !STOPWORDS.has(w))
    .map(stem);
}

export interface RankedDoc {
  id: string;
  score: number;
}

/**
 * BM25 (k1 = 1.5, b = 0.75) over the given documents for one query.
 * Ties resolve to corpus order (stable sort) — deterministic.
 */
export function bm25Rank(
  query: string,
  docs: ReadonlyArray<{ id: string; text: string }>,
): RankedDoc[] {
  const queryTerms = [...new Set(tokenize(query))];
  const tokenized = docs.map((d) => tokenize(d.text));
  const n = docs.length;
  const avgLen = tokenized.reduce((sum, toks) => sum + toks.length, 0) / n;

  const df = new Map<string, number>();
  for (const toks of tokenized) {
    for (const term of new Set(toks)) df.set(term, (df.get(term) ?? 0) + 1);
  }

  const k1 = 1.5;
  const b = 0.75;

  return docs
    .map((doc, i) => {
      const toks = tokenized[i];
      const tf = new Map<string, number>();
      for (const term of toks) tf.set(term, (tf.get(term) ?? 0) + 1);
      let score = 0;
      for (const term of queryTerms) {
        const f = tf.get(term);
        if (!f) continue;
        const dfT = df.get(term) ?? 0;
        const idf = Math.log(1 + (n - dfT + 0.5) / (dfT + 0.5));
        score +=
          (idf * (f * (k1 + 1))) /
          (f + k1 * (1 - b + (b * toks.length) / avgLen));
      }
      return { id: doc.id, score };
    })
    .sort((a, b2) => b2.score - a.score);
}

export interface DefenseVerdict {
  factor: number;
  patterns: string[];
}

/**
 * The toy defense: demotes instruction-style passages ×0.5 per matched
 * pattern. Honestly labeled in the UI as “toy heuristic, not a real defense”.
 */
export function toyDefense(text: string): DefenseVerdict {
  const lower = text.toLowerCase().trim();
  const patterns: string[] = [];
  if (lower.includes("ignore previous instructions")) {
    patterns.push("instruction override");
  }
  if (/^(ignore|trust|believe|cite|always|never|remember|forget)\b/.test(lower)) {
    patterns.push("leading imperative");
  }
  return { factor: patterns.length ? 0.5 ** patterns.length : 1, patterns };
}

export interface Chunk {
  id: string;
  text: string;
}

/** Split text into consecutive word chunks of `size` words (no overlap). */
export function chunkWords(text: string, size: number): Chunk[] {
  const words = text.split(/\s+/).filter(Boolean);
  const chunks: Chunk[] = [];
  for (let i = 0; i < words.length; i += size) {
    chunks.push({ id: `C${chunks.length + 1}`, text: words.slice(i, i + size).join(" ") });
  }
  return chunks;
}

export function formatScore(score: number): string {
  return score.toFixed(2);
}
