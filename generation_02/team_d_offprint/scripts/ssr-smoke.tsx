/**
 * SSR smoke test — renders every route with react-dom/server to catch
 * runtime errors (reference errors, bad hook usage, undefined data) that
 * a TypeScript-only check cannot see. Effects are not executed in SSR;
 * those paths are kept trivial and guarded.
 *
 *   npx esbuild scripts/ssr-smoke.tsx --bundle --platform=node \
 *     --format=cjs --jsx=automatic \
 *     --outfile=node_modules/.cache/ssr-smoke.cjs --log-level=warning
 *   node node_modules/.cache/ssr-smoke.cjs
 */
import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "../src/lib/theme";
import { AppRoutes } from "../src/App";
import { applyToyDefense, bm25 } from "../src/lib/bm25";
import { sandboxCorpus, sandboxQuery } from "../src/content/lab";

const routes: [string, string[]][] = [
  ["/", ["Grounded answers", "studied where they break", "THE QUESTION LEDGER", "0 PUBLICATIONS", "Poison Sandbox", "This site", "Corruption Sandbox", "COLOPHON", "这是一个占位段落"]],
  ["/lab/corruption-sandbox", ["Corruption Sandbox", "Illustrative toy", "BM25", "TOY HEURISTIC", "9 DOCUMENTS|8 DOCUMENTS"]],
  ["/nowhere", ["not in the edition"]],
];

let failures = 0;
for (const [path, expectations] of routes) {
  let html = "";
  try {
    html = renderToString(
      <ThemeProvider>
        <MemoryRouter initialEntries={[path]}>
          <AppRoutes />
        </MemoryRouter>
      </ThemeProvider>,
    );
    console.log(`OK   ${path}  (${html.length} chars)`);
  } catch (err) {
    console.error(`FAIL ${path}: ${err}`);
    failures += 1;
    continue;
  }
  for (const exp of expectations) {
    // React SSR splices dynamic text with <!-- --> markers; strip them.
    const hit = exp
      .split("|")
      .some((e) => html.replace(/<!-- -->/g, "").includes(e));
    if (!hit) {
      console.error(`  MISSING on ${path}: ${exp}`);
      failures += 1;
    }
  }
}

// Sandbox determinism through the real lib: d8 must be rank 1 clean.
const clean = sandboxCorpus.filter((d) => !d.poisoned);
const r1 = bm25(sandboxCorpus, sandboxQuery);
const r2 = applyToyDefense(r1, sandboxCorpus);
if (r1[0]?.id !== "d8") { console.error("FAIL sandbox: d8 not #1 on inject"); failures += 1; }
else console.log(`OK   sandbox inject → d8 #1 (${r1[0].score.toFixed(2)})`);
if (!(r2.findIndex((d) => d.id === "d8") + 1 > 3)) { console.error("FAIL sandbox: d8 inside top-3 under defense"); failures += 1; }
else console.log(`OK   sandbox defense → d8 rank ${r2.findIndex((d) => d.id === "d8") + 1}`);
if (clean.length !== 8) { console.error("FAIL sandbox: clean corpus != 8"); failures += 1; }
else console.log("OK   sandbox corpus reads 8 / 9 documents");

if (failures) {
  console.error(`\n${failures} check(s) failed.`);
  process.exit(1);
}
console.log("\nSSR smoke: all routes render, all gates pass.");
