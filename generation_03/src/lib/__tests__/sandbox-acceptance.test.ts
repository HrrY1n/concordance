import { describe, expect, it } from "vitest";
import { bm25Rank } from "@/lib/bm25";
import { sandboxCorpus, sandboxQuery, toyDefense } from "@/content/lab";

/**
 * CONTENT_PACK §demo acceptance invariants — the same gates the Gen 2 verify
 * scripts enforced, now part of the repo's own test suite:
 *   1. inject d8  -> d8 ranks #1
 *   2. defense on -> d8 out of the top-3
 * If a corpus edit breaks either, this fails — tune the corpus, not the code.
 */
describe("Corruption Sandbox acceptance (CONTENT_PACK §demo)", () => {
  const clean = sandboxCorpus.filter((d) => !d.poisoned);

  it("clean corpus has no poisoned documents and a fixed query", () => {
    expect(clean).toHaveLength(sandboxCorpus.length - 1);
    expect(sandboxQuery.length).toBeGreaterThan(10);
  });

  it("invariant 1: after injection, d8 ranks #1", () => {
    const ranked = bm25Rank(sandboxCorpus, sandboxQuery);
    expect(ranked[0].id).toBe("d8");
    expect(ranked[0].poisoned).toBe(true);
  });

  it("invariant 2: with the toy defense on, d8 leaves the top-3", () => {
    const ranked = bm25Rank(sandboxCorpus, sandboxQuery, {
      defense: { patterns: toyDefense.patterns, factor: toyDefense.factor },
    });
    const d8Rank = ranked.findIndex((r) => r.id === "d8") + 1;
    expect(d8Rank).toBeGreaterThan(3);
  });

  it("d8 drops to the bottom half of the full ranking under defense", () => {
    const ranked = bm25Rank(sandboxCorpus, sandboxQuery, {
      defense: { patterns: toyDefense.patterns, factor: toyDefense.factor },
    });
    const d8Rank = ranked.findIndex((r) => r.id === "d8") + 1;
    expect(d8Rank).toBeGreaterThanOrEqual(Math.ceil(ranked.length / 2));
  });

  it("the clean top-1 is a genuinely responsive document", () => {
    const cleanRanking = bm25Rank(clean, sandboxQuery);
    expect(["d1", "d2", "d3", "d4"]).toContain(cleanRanking[0].id);
  });
});
