import type { Profile } from "./types";

/**
 * CONTENT_PACK §profile — 中文优先视觉增强版（Chinese-first Visual Enrichment pass）。
 *
 * `name` 依然保持 null：公开署名通过 `handle`（HrrY1n）呈现，
 * 绝不向 Person JSON-LD 注入未确认的真实姓名。
 * `handle` 是公开的 GitHub 签名与主理人标识。
 * `identity` 清晰传达个人定位：计算机科学硕士生 × RAG 安全研究 × 独立软件工程。
 */
export const profile = {
  name: null,
  handle: "HrrY1n",
  identity: [
    "计算机科学硕士生",
    "RAG 可靠性 · 独立软件开发",
  ],
  about:
    "我是 HrrY1n，一名计算机科学方向的硕士研究生，主要关注检索增强生成（RAG）在现实扰动下的鲁棒性边界——尤其是当外部证据源存在嘈杂、相互冲突或被恶意投毒时，以检索先行的系统如何保持可控。\n\n" +
    "在工程与产品设计一侧，我坚持独立开发并持续维护具有真实效用的工具：包括本地优先的个人物品管理应用「Private Item Library」以及完全基于 Web Audio 程序化合成的声音工作台「SoundIsle·声屿」。\n\n" +
    "CONCORDANCE 是这两种探索的交汇处：既是一份可被检索、带有严谨坐标与浏览器内计算图版的研究档案，也是一处展示真实工程架构与设计决策的个人数字作品集。",
  aboutZh:
    "我是 HrrY1n，计算机科学方向硕士研究生与独立开发者。主要研究检索增强生成（RAG）及其安全鲁棒性，同时独立研发本地优先（Local-first）与 Web Audio 创意编程产品。本站为个人研究档案与数字作品集。",
  location: null,
} satisfies Profile & { aboutZh: string };
