#!/usr/bin/env node
/**
 * Aggregate judge scores for a round.
 * Usage: node aggregate_scores.mjs <reviews_dir> <teams_csv> [output_md]
 * e.g. node aggregate_scores.mjs reviews/round_01 A,B,C,D,E,F,G,H design_review_round_01.md
 *
 * Reads every reviews_dir/judge_*.md, extracts the last ```json block,
 * z-score normalizes each judge across teams (fairness across strict/lenient judges),
 * and ranks teams by mean normalized score.
 */
import fs from "node:fs";
import path from "node:path";

const [inputPath, teamsArg, outArg] = process.argv.slice(2);
if (!inputPath || !teamsArg) {
  console.error("Usage: node aggregate_round_01.mjs <round_01_scores.json> <teams_csv> [output_md]");
  process.exit(1);
}
const teams = teamsArg.split(",").map((s) => s.trim());
const data = JSON.parse(fs.readFileSync(inputPath, "utf8"));
const judges = data.judges.map((j) => ({
  file: j.file || "",
  judge: j.judge,
  scores: j.scores,
  top3: (j.top3 || []).map((t) => String(t).trim()),
}));

if (judges.length === 0) {
  console.error("No judge scores found.");
  process.exit(1);
}

// collect all dimension keys
const dims = new Set();
for (const j of judges) for (const t of Object.values(j.scores)) for (const k of Object.keys(t || {})) dims.add(k);

// per-judge z-score normalization across teams, per dimension
function normalize() {
  const norm = judges.map((j) => ({ ...j, norm: {} }));
  for (const j of norm) {
    for (const d of dims) {
      const vals = teams.map((t) => j.scores?.[t]?.[d]).filter((v) => typeof v === "number");
      if (vals.length < 2) continue;
      const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
      const sd = Math.sqrt(vals.reduce((a, b) => a + (b - mean) ** 2, 0) / vals.length) || 1;
      for (const t of teams) {
        const v = j.scores?.[t]?.[d];
        if (typeof v === "number") {
          j.norm[t] = j.norm[t] || {};
          j.norm[t][d] = (v - mean) / sd;
        }
      }
    }
  }
  return norm;
}

const norm = normalize();

// aggregate per team
const rows = teams.map((t) => {
  const perDim = {};
  const raw = {};
  for (const d of dims) {
    const zs = norm.map((j) => j.norm?.[t]?.[d]).filter((v) => typeof v === "number");
    const rs = judges.map((j) => j.scores?.[t]?.[d]).filter((v) => typeof v === "number");
    perDim[d] = zs.length ? zs.reduce((a, b) => a + b, 0) / zs.length : 0;
    raw[d] = rs.length ? rs.reduce((a, b) => a + b, 0) / rs.length : 0;
  }
  const normTotal = Object.values(perDim).reduce((a, b) => a + b, 0);
  const rawTotal = Object.values(raw).reduce((a, b) => a + b, 0);
  const top3pts = judges.reduce((acc, j) => {
    const i = j.top3.findIndex((x) => x.toUpperCase().startsWith(t.toUpperCase()));
    return acc + (i === 0 ? 3 : i === 1 ? 2 : i === 2 ? 1 : 0);
  }, 0);
  return { team: t, perDim, raw, normTotal, rawTotal, top3pts, judgeCount: judges.length };
});

rows.sort((a, b) => b.normTotal - a.normTotal || b.top3pts - a.top3pts);

// report
const dimList = [...dims];
let md = `# 评分汇总（${inputPath}）\n\n评委数：${judges.length}；维度数：${dimList.length}\n\n`;
md += `## 总排名（按评委内 z-score 归一化均值排序）\n\n`;
md += `| 排名 | Team | 归一化总分 | 原始均分 | Top3 票点 |\n|---|---|---|---|---|\n`;
rows.forEach((r, i) => {
  md += `| ${i + 1} | ${r.team} | ${r.normTotal.toFixed(2)} | ${(r.rawTotal / dimList.length).toFixed(2)} | ${r.top3pts} |\n`;
});
md += `\n## 各维度归一化均分\n\n`;
md += `| Team | ${dimList.join(" | ")} |\n`;
md += `|---|${dimList.map(() => "---").join("|")}|\n`;
for (const r of rows) {
  md += `| ${r.team} | ${dimList.map((d) => (r.perDim[d] || 0).toFixed(2)).join(" | ")} |\n`;
}
md += `\n## 各评委 Top3\n\n`;
for (const j of judges) md += `- ${j.judge} (${j.file}): ${j.top3.join(" > ")}\n`;

console.log(md);
if (outArg) fs.writeFileSync(outArg, md, "utf8");
