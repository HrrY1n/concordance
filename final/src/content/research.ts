import type { ResearchQuestion, ResearchTopic } from "./types";

/**
 * CONTENT_PACK §researchTopics — 6 大稳定研究方向（中文优先呈现）。
 * `adjoins` 与 `relatedDemo` 经严格类型约束。
 */
export const researchTopics = [
  {
    id: "rag",
    order: 1,
    name: "检索增强生成（RAG）",
    short: "RAG",
    blurb:
      "将大型语言模型锚定于外部检索证据而非仅依赖参数记忆。深入探索检索召回、条件上下文生成以及误差沿流水线传播的系统性闭环。",
    facetLine: "检索出的上下文，决定了模型能说出什么。",
    adjoins: ["robustness", "llm-systems", "retrieval-generation"],
  },
  {
    id: "robustness",
    order: 2,
    name: "RAG 鲁棒性研究",
    short: "鲁棒性",
    blurb:
      "真实语料往往伴随噪声、事实冲突甚至对抗性诱导。核心课题在于探讨以检索先行的系统在外部证据失真或受控时，如何衡量与维持其可靠性边界。",
    facetLine: "基于证据而立，直到证据本身发生偏折。",
    adjoins: ["rag", "poisoning"],
    relatedDemo: "rankers-side-by-side",
  },
  {
    id: "poisoning",
    order: 3,
    name: "知识库投毒与数据对抗",
    short: "知识投毒",
    blurb:
      "语料库中极少数对抗性构造的段落即可大幅操纵检索排名，进而左右生成答案。攻击面贯穿分块与重排序阶段，而有效防御必须在日常检索中保持低损耗。",
    facetLine: "掌控了语料的排位，就掌控了模型的发声。",
    adjoins: ["robustness", "ai-security"],
    relatedDemo: "corruption-sandbox",
  },
  {
    id: "ai-security",
    order: 4,
    name: "AI 系统工程安全",
    short: "系统安全",
    blurb:
      "面对提示词注入、数据投毒与评估作弊等对抗性场景时的工程防线建设，重点在于通过系统性工程架构严格限制潜在风险的破坏半径。",
    facetLine: "受控的损害范围，是系统工程固有的底线。",
    adjoins: ["poisoning"],
  },
  {
    id: "llm-systems",
    order: 5,
    name: "LLM / AI 系统工程架构",
    short: "AI架构",
    blurb:
      "RAG 既是算法命题更是严肃的系统工程：涵盖毫秒级延迟预算、动态索引实时性、持续评测流水线以及确保研究代码严谨落地的工程脚手架。",
    facetLine: "严谨的研究代码在真实流水线中证明自己。",
    adjoins: ["rag", "robustness"],
    relatedDemo: "context-budget",
  },
  {
    id: "retrieval-generation",
    order: 6,
    name: "检索与生成协同交互",
    short: "检索×生成",
    blurb:
      "检索决策本质上即是生成决策。文本切分粒度、加权排序与查询重构都在隐式塑造模型能够调用的事实空间，需在系统层面整体审视两者的协同。",
    facetLine: "分块边界的划定，本质上是一项策略决断。",
    adjoins: ["rag"],
  },
] satisfies ResearchTopic[];

/**
 * CONTENT_PACK §researchQuestions — 问题台账（Question Ledger）。
 *
 * 保持诚实空态：只有具备实质性持续投入的研究议题才会进入台账编号。
 * 空台账是当前阶段的真实状态，界面将以优雅的诚实空态呈现。
 */
export const researchQuestions: ResearchQuestion[] = [];
