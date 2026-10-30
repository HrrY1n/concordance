/**
 * 语录检索命令面板本地索引（Chinese-first Visual Enrichment pass）。
 *
 * 包含两层：
 * 1. 结构编目 RECORDS：页面、精选作品、深度案例、研究方向、问题台账、实验仪器与快捷动作；
 * 2. 语境行引言 PASSAGES：将长文笔记与语料切分为单句，使用纯前端 BM25 算法实时打分并输出高亮引证。
 */
import { DEMO_REGISTRY } from "@/content/ids";
import { budgetChunks, sandboxCorpus } from "@/content/lab";
import { cases } from "@/content/cases";
import { notes } from "@/content/notes";
import { projects } from "@/content/projects";
import { researchQuestions, researchTopics } from "@/content/research";
import { sections } from "@/lib/sections";
import { bm25Rank, tokenize } from "@/lib/bm25";

export type RecordType =
  | "PAGE"
  | "PROJECT"
  | "CASE"
  | "TOPIC"
  | "QUESTION"
  | "NOTE"
  | "DEMO"
  | "ACTION";

export interface SearchRecord {
  id: string;
  type: RecordType;
  title: string;
  hint: string;
  coord: string;
  route: string;
  /** ACTION 动作类型（如主题切换、回到顶部） */
  action?: "theme" | "top";
  keywords: string[];
}

export function buildIndex(): SearchRecord[] {
  const records: SearchRecord[] = [];

  records.push({
    id: "page-home",
    type: "PAGE",
    title: "首页前扉 (Home — Frontispiece)",
    hint: "全站一卷通读，附主理人定位、精选作品图版与实验概览",
    coord: "§00",
    route: "/",
    keywords: ["home", "hero", "frontispiece", "首页", "前扉", "hrry1n", "主页"],
  });

  for (const s of sections) {
    records.push({
      id: `page-${s.id}`,
      type: "PAGE",
      title: `${s.title} (${s.titleEn})`,
      hint: s.kicker,
      coord: `§${s.num}`,
      route: s.route,
      keywords: [s.id, s.title.toLowerCase(), s.titleEn.toLowerCase()],
    });
  }

  projects.forEach((p, i) => {
    const cs = cases.find((c) => c.projectId === p.id);
    const customKw =
      p.id === "item-storage-app"
        ? ["物品", "物品管理", "物资", "资产", "pwa", "local-first", "dexie", "indexeddb"]
        : p.id === "soundisle"
          ? ["声音", "音频", "工作台", "声屿", "web audio", "canvas", "专注"]
          : ["档案", "主页", "语录", "concordance"];
    records.push({
      id: `project-${p.id}`,
      type: "PROJECT",
      title: p.title,
      hint: p.summary,
      coord: `§02 · PLATE ${String(i + 1).padStart(2, "0")}`,
      route: cs ? `/work/${cs.slug}` : "/work",
      keywords: [
        ...p.tags.map((t) => t.toLowerCase()),
        ...customKw,
        p.kind,
        String(p.year),
        "作品",
        "项目",
      ],
    });
  });

  cases.forEach((c) => {
    const customKw =
      c.slug === "item-storage-app"
        ? ["物品", "物品管理", "物资", "资产", "pwa", "local-first", "dexie", "indexeddb"]
        : ["声音", "音频", "工作台", "声屿", "web audio", "canvas", "专注"];
    records.push({
      id: `case-${c.slug}`,
      type: "CASE",
      title: `${c.title} —— 深度案例复盘`,
      hint: c.summary,
      coord: "§02 · CASE",
      route: `/work/${c.slug}`,
      keywords: [
        ...c.stack.map((s) => s.toLowerCase()),
        ...customKw,
        c.kicker.toLowerCase(),
        "案例",
        "复盘",
        "架构",
      ],
    });
  });

  researchTopics.forEach((t) => {
    const customKw =
      t.id === "poisoning"
        ? ["投毒", "知识投毒", "恶意数据", "数据污染", "对抗攻击"]
        : t.id === "robustness"
          ? ["鲁棒性", "对抗", "可靠性", "评测"]
          : t.id === "rag"
            ? ["rag", "检索增强生成", "知识库"]
            : [t.short.toLowerCase()];
    records.push({
      id: `topic-${t.id}`,
      type: "TOPIC",
      title: t.name,
      hint: t.facetLine ?? t.blurb,
      coord: "§01",
      route: "/research",
      keywords: [t.short.toLowerCase(), t.id, ...customKw, "研究", "方向"],
    });
  });

  researchQuestions.forEach((q) => {
    records.push({
      id: `question-${q.id}`,
      type: "QUESTION",
      title: q.text,
      hint: `问题台账状态：${q.status}`,
      coord: "§01",
      route: "/research",
      keywords: [q.id, q.status, "问题", "台账"],
    });
  });

  notes.forEach((n) => {
    records.push({
      id: `note-${n.id}`,
      type: "NOTE",
      title: n.title,
      hint: n.summary,
      coord: "§04",
      route: `/notes/${n.id}`,
      keywords: [n.kind, n.date, "笔记", "文章", "长文"],
    });
  });

  for (const demo of Object.values(DEMO_REGISTRY)) {
    records.push({
      id: `demo-${demo.id}`,
      type: "DEMO",
      title: demo.title,
      hint: demo.blurb,
      coord: "§03",
      route: demo.route,
      keywords: [demo.id.replace(/-/g, " "), demo.method.toLowerCase(), "实验", "demo"],
    });
  }

  records.push(
    {
      id: "action-theme",
      type: "ACTION",
      title: "重新着色 (切换色彩主题)",
      hint: "色彩方案：跟随系统 → 浅色暖纸 → 深色阅读室",
      coord: "ACTION",
      route: "",
      action: "theme",
      keywords: ["theme", "dark", "light", "scheme", "主题", "浅色", "深色", "夜间"],
    },
    {
      id: "action-top",
      type: "ACTION",
      title: "返回顶端 (Back to top)",
      hint: "平滑滚动回 §00 前扉首屏",
      coord: "ACTION",
      route: "",
      action: "top",
      keywords: ["top", "scroll", "up", "顶部", "回顶"],
    },
  );

  return records;
}

/* ------------------------------ passages ---------------------------------- */

export interface Passage {
  id: string;
  text: string;
  title: string;
  coord: string;
  route: string;
}

const SENTENCE_SPLIT = /(?<=[.!?。！？])\s+/;

export function buildPassages(): Passage[] {
  const passages: Passage[] = [];

  for (const n of notes) {
    const blocks = n.body ?? [];
    blocks.forEach((block, bi) => {
      const sentences =
        block.type === "code"
          ? []
          : block.text.split(SENTENCE_SPLIT);
      sentences.forEach((sentence, si) => {
        if (sentence.trim().length < 8) return;
        passages.push({
          id: `passage-${n.id}-${bi}-${si}`,
          text: sentence.trim(),
          title: n.title,
          coord: `§04 · ${n.date}`,
          route: `/notes/${n.id}`,
        });
      });
    });
  }

  for (const doc of sandboxCorpus) {
    doc.text.split(SENTENCE_SPLIT).forEach((sentence, si) => {
      passages.push({
        id: `passage-sandbox-${doc.id}-${si}`,
        text: sentence.trim(),
        title: `知识投毒沙盒 —— ${doc.id}${doc.poisoned ? " (投毒段落)" : ""}`,
        coord: "§03 · L-01",
        route: "/lab/corruption-sandbox",
      });
    });
  }

  for (const chunk of budgetChunks) {
    chunk.text.split(SENTENCE_SPLIT).forEach((sentence, si) => {
      passages.push({
        id: `passage-budget-${chunk.id}-${si}`,
        text: sentence.trim(),
        title: `上下文预算 —— ${chunk.id}`,
        coord: "§03 · L-02",
        route: "/lab",
      });
    });
  }

  return passages;
}

export interface KwicHit extends Passage {
  score: number;
  matchStart: number;
  matchLength: number;
}

export function kwicWindow(
  text: string,
  start: number,
  length: number,
  leftRadius = 24,
  rightRadius = 60,
): { left: string; match: string; right: string } {
  const leftStart = Math.max(0, start - leftRadius);
  const rightEnd = Math.min(text.length, start + length + rightRadius);
  return {
    left: `${leftStart > 0 ? "… " : ""}${text.slice(leftStart, start)}`,
    match: text.slice(start, start + length),
    right: `${text.slice(start + length, rightEnd)}${rightEnd < text.length ? " …" : ""}`,
  };
}

export function queryPassages(passages: Passage[], rawQuery: string): KwicHit[] {
  const q = rawQuery.trim();
  if (!q) return [];
  const ranked = bm25Rank(passages, q).filter((hit) => hit.score > 0);
  const terms = [...tokenize(q)].sort((a, z) => z.length - a.length);
  const hits: KwicHit[] = [];
  for (const hit of ranked) {
    const passage = passages.find((p) => p.id === hit.id);
    if (!passage) continue;
    const lower = passage.text.toLowerCase();
    let matchStart = -1;
    let matchLength = 0;
    for (const term of terms) {
      const at = lower.indexOf(term.toLowerCase());
      if (at !== -1 && (matchStart === -1 || at < matchStart)) {
        matchStart = at;
        matchLength = term.length;
      }
    }
    if (matchStart === -1) continue;
    hits.push({ ...passage, score: hit.score, matchStart, matchLength });
    if (hits.length >= 3) break;
  }
  return hits;
}

/* ------------------------------- queries ---------------------------------- */

export const PALETTE_MAX_RESULTS = 8;

export function queryRecords(records: SearchRecord[], rawQuery: string): SearchRecord[] {
  const q = rawQuery.trim().toLowerCase();
  if (!q) {
    const pages = records.filter((r) => r.type === "PAGE" || r.type === "ACTION");
    const rest = records.filter((r) => r.type !== "PAGE" && r.type !== "ACTION");
    return [...pages, ...rest];
  }
  const terms = q.split(/\s+/);
  return records
    .map((r) => {
      const haystack = `${r.title} ${r.hint} ${r.keywords.join(" ")}`.toLowerCase();
      let score = 0;
      if (r.coord.toLowerCase() === q) score += 80;
      if (r.title.toLowerCase().startsWith(q)) score += 100;
      else if (r.title.toLowerCase().includes(q)) score += 60;
      else if (haystack.includes(q)) score += 30;
      const allTerms = terms.every((t) => haystack.includes(t));
      if (allTerms && score === 0) score = 20;
      return { r, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, z) => z.score - a.score)
    .map((x) => x.r);
}

export interface PaletteSelection {
  shown: SearchRecord[];
  totalMatches: number;
  truncated: boolean;
}

export function selectResults(ranked: SearchRecord[]): PaletteSelection {
  const actions = ranked.filter((r) => r.action);
  const content = ranked.filter((r) => !r.action);
  const shownContent = content.slice(0, PALETTE_MAX_RESULTS);
  return {
    shown: [...shownContent, ...actions],
    totalMatches: content.length,
    truncated: content.length > shownContent.length,
  };
}

export function indexSize(): string {
  return `${buildIndex().length + buildPassages().length}`;
}
