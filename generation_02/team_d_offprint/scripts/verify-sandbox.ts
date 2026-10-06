/**
 * Numerical acceptance check for the Corruption Sandbox (CONTENT_PACK §demo).
 * Runs the REAL shipped code (src/lib/bm25.ts + src/content/lab.ts), bundled
 * by esbuild. Not part of the app build (tsconfig includes only src/).
 *
 *   npx esbuild scripts/verify-sandbox.ts --bundle --platform=node \
 *     --format=esm --outfile=node_modules/.cache/verify-sandbox.mjs --log-level=warning
 *   node node_modules/.cache/verify-sandbox.mjs
 *
 * Gates (from the pack):
 *   1. Inject → d8 must rank #1.
 *   2. Toy defense on → d8 must drop out of the top-3.
 *   3. Readouts show 8 documents clean / 9 after injection.
 */
import { applyToyDefense, bm25 } from "../src/lib/bm25";
import { sandboxCorpus, sandboxQuery } from "../src/content/lab";

const clean = sandboxCorpus.filter((d) => !d.poisoned);
const full = sandboxCorpus;

let failures = 0;
function check(label: string, ok: boolean, detail: string) {
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}  ${detail}`);
  if (!ok) failures += 1;
}

const top = (docs: typeof full) =>
  bm25(docs, sandboxQuery)
    .slice(0, 5)
    .map((d) => `${d.id}:${d.score.toFixed(2)}`)
    .join("  ");

console.log("QUERY:", sandboxQuery);
console.log("clean top-5 :", top(clean));
console.log("injected top-5:", top(full));

const injected = bm25(full, sandboxQuery);
check("inject → d8 ranks #1", injected[0]?.id === "d8", `(top: ${injected[0]?.id})`);

const defended = applyToyDefense(injected, full);
const d8rank = defended.findIndex((d) => d.id === "d8") + 1;
console.log("defended top-5:", defended.slice(0, 5).map((d) => `${d.id}:${d.score.toFixed(2)}`).join("  "));
check("defense → d8 out of top-3", d8rank > 3 || !defended.some((d) => d.id === "d8"), `(d8 rank: ${d8rank})`);

check("clean corpus = 8 docs", clean.length === 8, `(${clean.length})`);
check("injected corpus = 9 docs", full.length === 9, `(${full.length})`);

if (failures > 0) {
  console.error(`\n${failures} gate(s) failed.`);
  process.exit(1);
}
console.log("\nAll sandbox acceptance gates pass.");
