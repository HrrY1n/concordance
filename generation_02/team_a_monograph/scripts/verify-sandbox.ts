/**
 * Acceptance verification for the Corruption Sandbox (CONTENT_PACK §demo):
 *   1. clean corpus ranks sensibly (every doc scores > 0)
 *   2. Inject → d8 must rank #1
 *   3. toy defense on → d8 must fall out of the top-3
 * Run:  npx esbuild scripts/verify-sandbox.ts --bundle --platform=node \
 *         --format=esm --outfile=scripts/.verify.mjs && node scripts/.verify.mjs
 */
import { bm25Rank, chunkWords, toyDefense } from "../src/lib/retrieval";
import { sandboxCorpus, sandboxQuery } from "../src/content/lab";

let failures = 0;
function check(name: string, ok: boolean, detail: string) {
  const mark = ok ? "PASS" : "FAIL";
  if (!ok) failures += 1;
  console.log(`${mark}  ${name}  ${detail}`);
}

const clean = sandboxCorpus.filter((d) => !d.poisoned);
const cleanRanked = bm25Rank(sandboxQuery, clean);
console.log("— clean corpus ranking —");
for (const r of cleanRanked) console.log(`  ${r.id}  ${r.score.toFixed(3)}`);
check(
  "clean corpus has signal",
  cleanRanked.every((r) => r.score > 0),
  `min = ${Math.min(...cleanRanked.map((r) => r.score)).toFixed(3)}`,
);

const poisoned = sandboxCorpus.filter((d) => d.poisoned);
const injectedRanked = bm25Rank(
  sandboxQuery,
  sandboxCorpus.map((d) => ({ id: d.id, text: d.text })),
);
console.log("— injected ranking (with d8) —");
for (const r of injectedRanked) console.log(`  ${r.id}  ${r.score.toFixed(3)}`);
check("inject: d8 ranks #1", injectedRanked[0]?.id === "d8", `top = ${injectedRanked[0]?.id}`);

const defended = sandboxCorpus.map((d) => {
  const verdict = toyDefense(d.text);
  const base = injectedRanked.find((r) => r.id === d.id)?.score ?? 0;
  return { id: d.id, score: base * verdict.factor, patterns: verdict.patterns };
});
defended.sort((a, b) => b.score - a.score);
console.log("— defended ranking (toy defense on) —");
for (const r of defended) console.log(`  ${r.id}  ${r.score.toFixed(3)}  [${r.patterns.join(", ")}]`);
const d8Rank = defended.findIndex((r) => r.id === "d8") + 1;
check("defense: d8 out of top-3", d8Rank > 3 || d8Rank === 0, `d8 rank = ${d8Rank}`);

const chunks = chunkWords(
  clean.map((d) => d.text).join(" "),
  24,
);
const chunkRanked = bm25Rank(sandboxQuery, chunks);
console.log(
  `— chunk demo (size 24) — ${chunks.length} chunks, top = ${chunkRanked[0]?.id} (${chunkRanked[0]?.score.toFixed(3)})`,
);
check("chunk demo produces a top chunk", (chunkRanked[0]?.score ?? 0) > 0, `chunks = ${chunks.length}`);

if (failures > 0) {
  console.error(`\n${failures} check(s) FAILED`);
  process.exit(1);
}
console.log("\nAll sandbox acceptance checks passed.");
