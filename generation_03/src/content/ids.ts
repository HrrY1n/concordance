/**
 * Compile-time identifier whitelists (§4 / D3).
 *
 * Cross-references between content files use literal unions derived here, so a
 * typo (e.g. `relatedDemo: "corruption-sandboxx"`) is a *type error*, not a
 * silently dead link at runtime. `DemoId` / `TopicId` are `keyof typeof`
 * unions over `as const` registries; the registries double as the runtime
 * source of truth (labels, routes) for the palette and the ledger.
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
  index: string; // "L-01" — the lab's own plate numbering
  title: string;
  blurb: string;
  method: string;
  route: string; // deep link; sandbox gets its own page, others anchor on /lab
  anchor: string; // in-page anchor id on /lab
  flagship: boolean;
}

export const DEMO_REGISTRY: Record<DemoId, DemoMeta> = {
  "corruption-sandbox": {
    id: "corruption-sandbox",
    index: "L-01",
    title: "Corruption Sandbox",
    blurb:
      "Inject one poisoned passage into a hand-written corpus, watch a live BM25 ranking rewrite itself, then toggle a toy defense and watch it rewrite again.",
    method: "BM25 (k1 1.5 · b 0.75), computed in your browser",
    route: "/lab/corruption-sandbox",
    anchor: "demo-corruption-sandbox",
    flagship: true,
  },
  "context-budget": {
    id: "context-budget",
    index: "L-02",
    title: "Context Budget",
    blurb:
      "A token budget and five chunks, in an order you control. Order decides what fits — which is why reranking is a decision about what evidence exists.",
    method: "chars ÷ 4 token estimate, computed in your browser",
    route: "/lab",
    anchor: "demo-context-budget",
    flagship: false,
  },
  "rankers-side-by-side": {
    id: "rankers-side-by-side",
    index: "L-03",
    title: "Rankers, Side by Side",
    blurb:
      "The same corpus, the same query, two lexical rankers: raw TF·IDF and BM25. The only difference is length normalization — and it changes the top slot.",
    method: "TF·IDF vs BM25 (k1 1.5 · b 0.75), computed in your browser",
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
