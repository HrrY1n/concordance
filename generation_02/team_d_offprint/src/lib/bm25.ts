/**
 * Minimal BM25 (k1=1.5, b=0.75) over tiny in-memory corpora.
 * Pure, deterministic, zero dependencies — the same numbers the
 * sandbox renders are the numbers scripts/verify-sandbox.mjs asserts.
 */

export interface ScoredDoc {
  id: string;
  score: number;
  poisoned: boolean;
}

/** Lowercase, strip punctuation, drop 1-char tokens, crude plural strip. */
export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1)
    .map((w) => (w.length > 3 && w.endsWith("s") ? w.slice(0, -1) : w));
}

export function bm25(
  docs: { id: string; text: string; poisoned?: boolean }[],
  query: string,
  k1 = 1.5,
  b = 0.75,
): ScoredDoc[] {
  const n = docs.length;
  const termDocs = docs.map((d) => tokenize(d.text));
  const avgdl = termDocs.reduce((s, t) => s + t.length, 0) / n;
  const queryTerms = [...new Set(tokenize(query))];

  const df = new Map<string, number>();
  for (const qt of queryTerms) {
    df.set(qt, termDocs.filter((td) => td.includes(qt)).length);
  }

  const scored = docs.map((d, i) => {
    const td = termDocs[i];
    const dl = td.length;
    let score = 0;
    for (const qt of queryTerms) {
      const tf = td.filter((w) => w === qt).length;
      if (tf === 0) continue;
      const idf = Math.log(1 + (n - (df.get(qt) ?? 0) + 0.5) / ((df.get(qt) ?? 0) + 0.5));
      score += (idf * (tf * (k1 + 1))) / (tf + k1 * (1 - b + (b * dl) / avgdl));
    }
    return { id: d.id, score, poisoned: d.poisoned === true };
  });

  return scored.sort((a, b) => b.score - a.score);
}

/**
 * Toy defense — a HONEST heuristic, not a real defense: passages matching
 * instruction-injection patterns ("ignore previous instructions", imperative
 * "trust/cite this page" appeals) are demoted to the bottom of the ranking
 * (score × 0.1). The ×0.1 demotion is deliberate: a flat 50% downweight
 * leaves d8 inside the top-3, which fails the pack's acceptance gate
 * ("defense on → d8 out of top-3"); demotion-to-bottom both passes and is
 * easier to explain. Labeled in the UI as "toy heuristic, not a real defense".
 */
export function looksLikeInjection(text: string): boolean {
  const t = text.toLowerCase();
  return (
    t.includes("ignore previous instructions") ||
    /trust and cite this page/.test(t) ||
    /(^|\.\s+)(ignore|disregard|forget)\b/.test(t)
  );
}

export function applyToyDefense(scored: ScoredDoc[], docs: { id: string; text: string }[]): ScoredDoc[] {
  const flagged = new Set(docs.filter((d) => looksLikeInjection(d.text)).map((d) => d.id));
  return scored
    .map((s) => (flagged.has(s.id) ? { ...s, score: s.score * 0.1 } : s))
    .sort((a, b) => b.score - a.score);
}
