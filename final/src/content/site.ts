/**
 * 全站文案与品牌语义层（Chinese-first Visual Enrichment pass）。
 *
 * 保持 URL 单一事实来源；将主视觉文案、Hero 标题体系、联络与搜索文案
 * 重塑为中文优先，同时保留严谨、克制、带有学术出版物美感的气质。
 */
import { profile } from "./profile";

export const site = {
  sample: false,

  /** 站点英文名称 —— 语录索引（Concordance）是一部既是书籍又是检索系统的典籍 */
  name: "Concordance",
  /** 站点中文主标语 */
  tagline: "HrrY1n 的研究档案与数字作品集",
  description:
    "HrrY1n 的个人主页与研究档案 —— 聚焦检索增强生成（RAG）的鲁棒性与知识投毒，" +
    "记录独立软件工程与产品设计实践。所有计算均在浏览器内完成，每一条读数均源自真实数据。",

  /** 生产环境基准 URL（单源事实） */
  url: "https://hrry1n.github.io/concordance/",

  /**
   * Hero 双声部主标题：
   * 无衬线黑体呈现严谨学术陈述，衬线斜体呈现人的设计与工程态度
   */
  heroSans: ["检索增强生成的破损之处，", "与带着证据链的"],
  heroSerif: "软件工程实践。",
  heroEnSub: "RESEARCH × ENGINEERING × DESIGN",
  heroLede:
    "我是 HrrY1n，计算机科学方向硕士研究生与独立开发者。这里记录我对检索增强生成（RAG）" +
    "鲁棒性、知识投毒与 AI 系统的研究，以及包含本地优先物品管理 PWA 与纯代码合成声音工作台在内的真实作品。",

  /** 联系页面文案 */
  connectIntro:
    "通讯与公开联络渠道。所有列出的渠道均真实可用，最快得到回应的通道排列在首位。",
  connectFastest: "当前最直接的联络方式：",
  connectEmptyTitle: "暂未配置公开联络方式。",

  /** 发表页面空态文案 */
  publicationsEmptyTitle: "学术成果将在此归档",
  publicationsEmptyBody:
    "当前档案中尚未收录正式发表记录。待发表与提交成果进入正式阶段后，将附带其完整证据链在此呈现。",
  publicationsReserved: "保留位 —— 下一项成果将在此自动编号",

  /** 搜索面板 */
  searchLabel: "检索本站档案与作品",
  searchPlaceholder: "检索档案与作品 —— 尝试搜索 “投毒” 或 “local-first”",
} as const;

/** 首页身份读数行 */
export const heroIdentity = profile.identity.join(" · ");

/** 品牌标识：优先突出 HrrY1n 主理人身份，同时在 profile.name 为 null 时不触发虚假 Person JSON-LD */
export const brand = profile.name
  ? `${profile.name} — Concordance`
  : profile.handle
    ? `${profile.handle} · Concordance`
    : "Concordance";

/** 页面标题语法 */
export const homeTitle = `${brand} — 研究档案与数字作品集`;
export const titleSuffix = brand;
