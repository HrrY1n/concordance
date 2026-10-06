/**
 * Corruption Sandbox acceptance test — CONTENT_PACK §Lab Demo invariants:
 *   1. After injection, d8 must rank #1.
 *   2. With the toy defense on, d8 must leave the top-3.
 * "调语料而非改代码作弊": the corpus is tuned, never the scorer.
 *
 * Loads the REAL app modules (src/lib/bm25.ts, src/content/lab.ts) through
 * vite's ssrLoadModule so there is exactly one source of truth.
 *
 * Run:  node scripts/verify-sandbox.mjs   (from this directory)
 */
import { createServer } from "vite";

const vite = await createServer({
  root: process.cwd(),
  logLevel: "error",
  server: { middlewareMode: true },
  appType: "custom",
});

try {
  const { bm25Rank } = await vite.ssrLoadModule("/src/lib/bm25.ts");
  const lab = await vite.ssrLoadModule("/src/content/lab.ts");

  const corpus = lab.sandboxCorpus;
  const query = lab.sandboxQuery;
  const defense = { patterns: lab.toyDefense.patterns, factor: lab.toyDefense.factor };

  const clean = bm25Rank(corpus.filter((d) => !d.poisoned), query);
  const injected = bm25Rank(corpus, query);
  const defended = bm25Rank(corpus, query, { defense });

  const fmt = (rows) =>
    rows.map((r, i) => `  ${i + 1}. ${r.id}  ${r.score.toFixed(4)}`).join("\n");

  console.log(`QUERY: "${query}"\n`);
  console.log(`CLEAN corpus (${clean.length} docs):\n${fmt(clean)}\n`);
  console.log(`INJECTED corpus (${injected.length} docs):\n${fmt(injected)}\n`);
  console.log(`INJECTED + toy defense (x${defense.factor}):\n${fmt(defended)}\n`);

  const failures = [];
  if (injected[0]?.id !== "d8") {
    failures.push(`FAIL: after injection the top result is ${injected[0]?.id}, expected d8`);
  }
  const defendedTop3 = defended.slice(0, 3).map((r) => r.id);
  if (defendedTop3.includes("d8")) {
    failures.push(`FAIL: with the toy defense d8 is still in the top 3 (${defendedTop3.join(", ")})`);
  }
  if (!(clean[0]?.score > 0)) {
    failures.push("FAIL: clean corpus produced no positive scores");
  }

  if (failures.length > 0) {
    console.error(failures.join("\n"));
    process.exitCode = 1;
  } else {
    console.log("PASS: d8 ranks #1 after injection and leaves the top-3 under the toy defense.");
  }
} finally {
  await vite.close();
}
