// Relative imports (not "@/" aliases): this module is also imported by
// vite.config.ts, whose bundle resolves before the alias exists.
import { cases, caseBySlug } from "../content/cases";
import { noteById, notes } from "../content/notes";
import { homeTitle, site, titleSuffix } from "../content/site";

const STATIC_ROUTES = [
  "/",
  "/research",
  "/work",
  "/lab",
  "/lab/corruption-sandbox",
  "/notes",
  "/publications",
  "/about",
  "/connect",
] as const;

export function sitemapPaths(): string[] {
  return [
    ...STATIC_ROUTES,
    ...cases.map((c) => `/work/${c.slug}`),
    ...notes.map((note) => `/notes/${note.id}`),
  ];
}

export function sitemapUrls(): string[] {
  const base = site.url.endsWith("/") ? site.url : `${site.url}/`;
  const urls = sitemapPaths().map((path) => (path === "/" ? base : `${base}${path.replace(/^\//, "")}`));
  return [...new Set(urls)].sort();
}

/* ------------------------- per-route head metadata ------------------------ */

const STATIC_PAGE_META: Record<string, { title: string; description: string }> = {
  "/research": {
    title: "研究方向体系",
    description:
      "学术研究方向：检索增强生成（RAG）、鲁棒性、知识库对抗投毒、AI 系统工程安全及检索-生成协同机制。",
  },
  "/work": {
    title: "精选作品",
    description:
      "带着真实证据链的软件作品：本地优先个人物资管理 PWA、纯前端声学合成专注工作台与本站自身。",
  },
  "/lab": {
    title: "实验室仪器",
    description:
      "面向研究方向的纯前端实验仪器：知识投毒沙盒、上下文预算折算器与检索算法双轨对照。所有运算完全在本地执行。",
  },
  "/lab/corruption-sandbox": {
    title: "知识投毒模拟沙盒",
    description:
      "向语料库中注入伪造段落，实时观察 BM25 排序如何被颠覆；随后开启启发式过滤策略，观察排序再次重组。所有运算均在浏览器本地执行。",
  },
  "/notes": {
    title: "工程笔记",
    description: "记录本档案自身的软件架构、TypeScript 类型体系与前端检索实现的工程长文。",
  },
  "/publications": {
    title: "学术发表",
    description: "学术论文与同行评审收录。所有发表记录与证据链按真实存在呈现 —— 绝不预填空洞的承诺。",
  },
  "/about": {
    title: "关于主理人与档案",
    description:
      "计算机科学方向硕士研究生，研究 RAG 安全鲁棒性，同时独立研发真实软件产品 —— 本档案是两者相交汇的坐标系。",
  },
  "/connect": {
    title: "联络通道",
    description: "公开通讯与社交主页 —— 所有通道按真实存在呈现，绝不摆设虚假占位。",
  },
};

export interface RouteHead {
  title: string;
  description: string;
  canonical: string;
}

export function routeHead(path: string): RouteHead {
  const base = site.url.endsWith("/") ? site.url : `${site.url}/`;
  const canonical = path === "/" ? base : `${base}${path.replace(/^\//, "")}`;
  if (path === "/") {
    return { title: homeTitle, description: site.description, canonical };
  }
  if (path.startsWith("/work/")) {
    const c = caseBySlug(path.slice("/work/".length));
    if (c) {
      return {
        title: `${c.title} — 深度案例复盘 — ${titleSuffix}`,
        description: c.summary,
        canonical,
      };
    }
  }
  if (path.startsWith("/notes/")) {
    const n = noteById(path.slice("/notes/".length));
    if (n) {
      return { title: `${n.title} — ${titleSuffix}`, description: n.summary, canonical };
    }
  }
  const s = STATIC_PAGE_META[path];
  return {
    title: s ? `${s.title} — ${titleSuffix}` : titleSuffix,
    description: s?.description ?? site.description,
    canonical,
  };
}
