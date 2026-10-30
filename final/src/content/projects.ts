import type { Project } from "./types";

/**
 * CONTENT_PACK §projects — 三件可完全核验的真实作品（中文优先呈现）。
 * 所有条目均直链公开的 GitHub 代码仓库，杜绝虚构履历。
 * 排列顺序即展示顺序，首项作为首页旗舰图版展出。
 */
export const projects = [
  {
    id: "item-storage-app",
    sample: false,
    featured: true,
    year: 2026,
    kind: "tool",
    title: "Private Item Library · 个人私密物品归置",
    summary:
      "本地优先（Local-first）的个人物品与资产管理 PWA。数据完全保存在设备本地 IndexedDB，" +
      "支持全生命周期追踪、持有与日均成本核算、点阵保修倒计时、校验 ZIP 备份恢复及配对码可选云同步。" +
      "离线是默认常态，而非网络异常时的降级体验。",
    role: "独立全栈研发（产品设计 · 前端架构 · 文档体系）",
    status: "active",
    tags: ["React 19", "TypeScript", "Dexie 4", "IndexedDB", "PWA", "Local-first"],
    links: {
      github: "https://github.com/HrrY1n/item-storage-app",
      demo: null,
      writeup: null,
    },
  },
  {
    id: "soundisle",
    sample: false,
    featured: true,
    year: 2026,
    kind: "tool",
    title: "SoundIsle · 声屿专注工作台",
    summary:
      "纯前端程序化合成的声音专注空间。零外部音频素材依赖，基于 Web Audio 节点网络实时合成 6 组环境音景，" +
      "配合随实时频谱律动的 Canvas 夜海交互场景与防后台漂移专注计时器。打包体积仅 35 KB JavaScript。",
    role: "独立全栈研发（声学合成 · Canvas 视觉 · 交互架构）",
    status: "maintained",
    tags: ["Web Audio API", "Canvas 2D", "TypeScript", "创意编程", "极简单页应用"],
    links: {
      github: "https://github.com/HrrY1n/soundisle",
      demo: null,
      writeup: null,
    },
  },
  {
    id: "this-site",
    sample: false,
    featured: true,
    year: 2026,
    kind: "site",
    title: "Concordance · 个人研究与作品档案",
    summary:
      "以书籍索引与检索编目为隐喻构建的数据驱动型个人网站。全站内容以严格的 TypeScript 类型契约组织，" +
      "所有统计读数由数据动态派生，所有图版在浏览器内纯本地计算，静态深链构建输出，支持免于推翻重构的长青演进。",
    role: "设计系统与工程实现",
    status: "active",
    tags: ["TypeScript", "Design Systems", "Tailwind CSS", "React 19"],
    links: {
      github: "https://github.com/HrrY1n/concordance",
      demo: null,
      writeup: null,
    },
  },
] satisfies Project[];

/**
 * 证据链（Evidence Chains）—— PLATE 版式语言的核心事实支撑。
 * `Record<ProjectId, EvidenceChain>` 保证任何新增项目均必须提交完整的真实证据链。
 */
export type ProjectId = (typeof projects)[number]["id"];

export interface EvidenceChain {
  problem: string; // 核心问题（以问句形式呈现）
  method: string[]; // 动词开头的关键工程实现步骤
  artifacts: string[]; // 真实存在且公开可核查的交付物
}

export const chains: Record<ProjectId, EvidenceChain> = {
  "item-storage-app": {
    problem:
      "在无中心化服务器前提下，个人私有物资与开销数据如何应对设备故障、完全离线和 Schema 版本演进？",
    method: [
      "基于 Dexie 在浏览器端直接驱动 IndexedDB 完成全量数据持久化",
      "建立严谨的 Schema 版本迁移机制并针对每次版本升级编写自动化测试",
      "基于 JSZip 提供带哈希校验的业务数据与用户资产无损导出与恢复",
      "仅在用户需要时通过一次性配对码建立端到端增量同步通道",
    ],
    artifacts: [
      "公开开源仓库：github.com/HrrY1n/item-storage-app",
      "基于 fake-indexeddb 的完整 Vitest 单元测试（覆盖 Schema 迁移、数据仓库与同步逻辑）",
      "14 张多视口界面实测截图与版本留档（存于项目 docs/screenshots/current/）",
    ],
  },
  soundisle: {
    problem:
      "能否彻底抛弃几十兆笨重的音频采样文件，仅靠纯代码在前端实时合成富有呼吸感且无接缝的环境音效？",
    method: [
      "基于原生振荡器、滤波粉红/棕色噪声及低频调制器构建纯算法音景配方",
      "抽离各声道实时声学频谱数据，直接驱动 Canvas 夜海波浪的物理色相与振幅",
      "设计去直流电平与 60ms 环绕交叉淡化算法，消除长时间循环时的爆音接缝",
      "基于 Date.now 绝对时间锚定状态机，根治移动端后台进程被节流导致的计时漂移",
    ],
    artifacts: [
      "公开开源仓库：github.com/HrrY1n/soundisle",
      "覆盖专注状态机、统计累加与持久化存储的 Vitest 自动化测试",
      "详尽的 7 轮声音调校、性能优化与 PCM 防削波工程记录（docs/iterations.md）",
    ],
  },
  "this-site": {
    problem: "如何打造一个兼具严谨学术品味与现代工程实力、且无需频繁重做架构的个人主页？",
    method: [
      "让数据成为第一等公民：全站内容结构化，页面仅作为数据的严谨视口",
      "设计 PLATE / LEDGER / ESSAY 三档排版律动，彻底告别模板化卡片堆积",
      "在构建期自动化提取 sitemap 并为全部深链生成独立 HTTP 200 静态页面入口",
    ],
    artifacts: [
      "公开开源仓库：github.com/HrrY1n/concordance",
      "内容类型安全契约与 96 项 Vitest 自动化防护测试",
      "涵盖 3 轮多智能体设计演进与 30 份独立评委审查的完整开发历史档案",
    ],
  },
};
