#!/usr/bin/env node
/**
 * Extract the last ```json block from every reviews/round_XX/judge_*.md
 * and merge into reports/round_XX_scores.json in the shape aggregate_round_01.mjs expects:
 * { judges: [ { file, judge, scores, top3, fixes } ] }
 *
 * Usage: node extract_scores.mjs <reviews_dir> <out_json>
 */
import fs from "node:fs";
import path from "node:path";

const [dir, out] = process.argv.slice(2);
if (!dir || !out) {
  console.error("Usage: node extract_scores.mjs <reviews_dir> <out_json>");
  process.exit(1);
}
const files = fs.readdirSync(dir).filter((f) => /^judge_.*\.md$/.test(f)).sort();
const judges = [];
for (const f of files) {
  const text = fs.readFileSync(path.join(dir, f), "utf8");
  const blocks = [...text.matchAll(/```json\s*([\s\S]*?)```/g)];
  if (!blocks.length) {
    console.warn(`WARN: no json block in ${f}`);
    continue;
  }
  try {
    const obj = JSON.parse(blocks[blocks.length - 1][1]);
    judges.push({
      file: f,
      judge: obj.judge || f,
      scores: obj.scores || {},
      top3: obj.top3 || [],
      fixes: obj.fixes || {},
    });
  } catch (e) {
    console.warn(`WARN: parse failed for ${f}: ${e.message}`);
  }
}
fs.writeFileSync(out, JSON.stringify({ judges }, null, 2));
console.log(`extracted ${judges.length} judges from ${files.length} files -> ${out}`);
