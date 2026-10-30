/**
 * 章节地址系统（Section Registry）—— 站点的坐标核心（§00–§07）。
 *
 * 中文优先版：大标题与说明文字以高品质中文呈现，同时保留次级英文索引，
 * 命令面板、页眉常驻导航与页脚均由数据计算派生（诚实读数，杜绝硬编码）。
 */
import { notes } from "@/content/notes";
import { timeline } from "@/content/timeline";
import { publications } from "@/content/publications";
import { projects } from "@/content/projects";
import { researchQuestions, researchTopics } from "@/content/research";
import { budgetChunks, sandboxCorpus } from "@/content/lab";
import { DEMO_REGISTRY } from "@/content/ids";
import type { RoutePath } from "@/content/ids";

/** 真实统计读数 —— 严格派生自各模块数据 */
export const DEMO_COUNT = Object.keys(DEMO_REGISTRY).length;
export const LAB_RECORD_COUNT = sandboxCorpus.length + budgetChunks.length;

export interface SectionMeta {
  num: string;
  id: string;
  title: string;
  titleEn: string;
  route: RoutePath;
  kicker: string;
  /** 章节页眉右侧的真实数据读数 */
  reading: string;
}

export const sections: SectionMeta[] = [
  {
    num: "01",
    id: "research",
    title: "研究",
    titleEn: "Research",
    route: "/research",
    kicker: "研究方向与开放问题",
    reading: `${researchTopics.length} 个方向 · ${researchQuestions.length} 个问题`,
  },
  {
    num: "02",
    id: "work",
    title: "精选作品",
    titleEn: "Selected Work",
    route: "/work",
    kicker: "项目图版与证据链",
    reading: `${projects.length} 项成果 · 附完整案例`,
  },
  {
    num: "03",
    id: "lab",
    title: "实验室",
    titleEn: "Lab",
    route: "/lab",
    kicker: "浏览器内可交互仪器",
    reading: `${DEMO_COUNT} 项演示 · 纯前端运算`,
  },
  {
    num: "04",
    id: "notes",
    title: "笔记",
    titleEn: "Notes",
    route: "/notes",
    kicker: "工程思考与长文归档",
    reading: `${notes.length} 篇归档`,
  },
  {
    num: "05",
    id: "publications",
    title: "学术发表",
    titleEn: "Publications",
    route: "/publications",
    kicker: "同行评审与发表成果",
    reading: `${publications.length} 篇收录`,
  },
  {
    num: "06",
    id: "about",
    title: "关于",
    titleEn: "About",
    route: "/about",
    kicker: "主理人背景与档案理念",
    reading: "",
  },
  {
    num: "07",
    id: "connect",
    title: "联络通道",
    titleEn: "Connect",
    route: "/connect",
    kicker: "公开通讯与社交主页",
    reading: "",
  },
];

/** 诚实读数：判断是否残留 sample 占位 */
export const hasSampleEntries = [
  ...projects,
  ...notes,
  ...researchQuestions,
  ...timeline,
].some((entry) => entry.sample === true);

export const colophonHonesty = hasSampleEntries
  ? "内容文件中标记为 sample 的条目为待替换的示例数据 —— 展示格式真实有效，本站其余部分均为实盘。"
  : "全站正式条目均有据可查 —— 作品直链公开代码仓库，实验室演示基于说明清晰的教学数据，尚未配置的个人资料保持诚实空态。";

export const sectionByRoute = (route: string): SectionMeta | undefined =>
  sections.find((s) => s.route === route);

/** 页脚底部单行数据盘点：实时计算各项内容规模 */
export const corpusReading = (): string =>
  [
    `精选作品 ${projects.length}`,
    `研究方向 ${researchTopics.length}`,
    `问题台账 ${researchQuestions.length}`,
    `工程笔记 ${notes.length}`,
    `论文收录 ${publications.length}`,
    `实验仪器 ${DEMO_COUNT} 项`,
  ].join(" · ");
