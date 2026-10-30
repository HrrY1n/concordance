/**
 * 编译期合法标识符白名单（Compile-time identifier whitelists）。
 *
 * 内容文件间的交叉引用利用字面量联合类型予以约束，
 * 拼写错误将在编译期直接阻断构建。
 */

export const TOPIC_IDS = [
  "rag",
  "robustness",
  "poisoning",
  "ai-security",
  "llm-systems",
  "retrieval-generation",
] as const;
export type TopicId = (typeof TOPIC_IDS)[number];

export const DEMO_IDS = [
  "corruption-sandbox",
  "context-budget",
  "rankers-side-by-side",
] as const;
export type DemoId = (typeof DEMO_IDS)[number];

export interface DemoMeta {
  id: DemoId;
  index: string; // "L-01"
  title: string;
  blurb: string;
  method: string;
  route: string;
  anchor: string;
  flagship: boolean;
}

export const DEMO_REGISTRY: Record<DemoId, DemoMeta> = {
  "corruption-sandbox": {
    id: "corruption-sandbox",
    index: "L-01",
    title: "知识投毒模拟沙盒 (Corruption Sandbox)",
    blurb:
      "向语料库中注入一段伪造段落，直观呈现 BM25 排序如何被瞬间颠覆；随后开启启发式过滤策略，观察排序再次重组。",
    method: "BM25 算法（k1 1.5 · b 0.75）· 浏览器纯本地计算",
    route: "/lab/corruption-sandbox",
    anchor: "demo-corruption-sandbox",
    flagship: true,
  },
  "context-budget": {
    id: "context-budget",
    index: "L-02",
    title: "上下文预算动态截断 (Context Budget)",
    blurb:
      "在严格的 Token 预算限制下重排 5 个文本块。切分与重排序的先后次序直接决定了哪些证据能进入上下文窗口、哪些被硬性截断。",
    method: "字符折算估算 Token 预算 · 纯本地即时重排",
    route: "/lab",
    anchor: "demo-context-budget",
    flagship: false,
  },
  "rankers-side-by-side": {
    id: "rankers-side-by-side",
    index: "L-03",
    title: "排序算法双轨对照 (Rankers Side-by-Side)",
    blurb:
      "相同语料与检索词下对比原生 TF·IDF 与 BM25 的打分差异。长度归一化机制的有无，将直接导致首位推荐结果的易主。",
    method: "TF·IDF vs BM25 实时打分矩阵 · 纯本地运算",
    route: "/lab",
    anchor: "demo-rankers-side-by-side",
    flagship: false,
  },
};

export const ROUTE_PATHS = [
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
export type RoutePath = (typeof ROUTE_PATHS)[number];
