import type { Profile } from "./types";

/**
 * CONTENT_PACK §profile — Real Content & Cases pass.
 *
 * `name` stays null ON PURPOSE: the owner has provided a public positioning
 * and a public handle (HrrY1n) but not a legal name, and the JSON-LD build
 * step must not infer a Person schema from a handle. `handle` is the public
 * GitHub signature — rendered as an @-handle, never presented as a real name.
 * `location` stays null: not provided.
 *
 * The `about` copy now carries the owner-confirmed positioning (CS master's
 * student; RAG / robustness / knowledge poisoning / AI security; independent
 * software with engineering care) — interests and built software only, no
 * achievements, affiliations, or publications. The Chinese sentence is a
 * separate extension field (`aboutZh`) so About can wrap it in lang="zh".
 */
export const profile = {
  name: null,
  handle: "HrrY1n",
  identity: [
    "Computer Science — Master's",
    "RAG robustness · knowledge poisoning · AI security",
    "Independent software",
  ],
  about:
    "I am a computer science master's student working on retrieval-augmented generation — " +
    "especially what retrieval-grounded systems do when their evidence is noisy, conflicting, " +
    "or deliberately poisoned. On the engineering side I build and maintain small, real " +
    "products: a local-first inventory PWA and a browser-native sound workbench. This archive " +
    "is where the two meet — research directions, working instruments, and case studies that " +
    "keep their evidence attached.",
  // Same statement, in Chinese; wrapped in lang="zh" on About (G5).
  aboutZh:
    "我是一名计算机科学方向的硕士研究生，研究检索增强生成——尤其是当证据变得嘈杂、冲突或被" +
    "蓄意污染时，检索先行的系统会发生什么。工程一侧，我开发并维护小而真实的产品：一个本地优先的" +
    "物品管理 PWA 和一个完全运行在浏览器里的声音工作台。这个档案是两条线的交汇处——研究方向、" +
    "可运行的仪器，以及带着证据链的案例。",
  location: null,
} satisfies Profile & { aboutZh: string };
