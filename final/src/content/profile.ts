import type { Profile } from "./types";

/**
 * CONTENT_PACK §profile. name/location stay null until real values exist;
 * every UI that renders them degrades gracefully. The Chinese sentence is a
 * separate extension field (`aboutZh`) so About can wrap it in lang="zh" and
 * the :lang(zh) type rules apply properly (G5).
 */
export const profile = {
  name: null,
  identity: ["Computer Science", "Research × Engineering"],
  // Honesty rule (placeholder pass): the about copy describes the ARCHIVE's
  // state — no position, affiliation, or first-person research claims — until
  // real biographical content is configured.
  about:
    "This archive is live, but its biography is not written yet: no name, affiliation, " +
    "or record has been configured. What you can browse here — directions, questions, " +
    "instruments, notes — is sample corpus for a concordance about retrieval-augmented " +
    "generation and what happens when evidence turns noisy or poisoned.",
  // Same statement, in Chinese; wrapped in lang="zh" on About (G5).
  aboutZh:
    "这个档案已经上线，但它的传记尚未写下——姓名、单位与经历都还没有配置。" +
    "你现在能浏览的方向、问题与工具，都是关于检索增强生成及其鲁棒性的示例语料，且均已标注。",
  location: null,
} satisfies Profile & { aboutZh: string };
