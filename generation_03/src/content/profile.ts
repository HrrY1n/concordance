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
  about:
    "Graduate student in computer science. I work on retrieval-augmented generation — " +
    "LLM systems that ground their answers in retrieved evidence, and what happens when " +
    "that evidence is noisy, conflicting, or deliberately poisoned. I build tools to make " +
    "those failure modes visible, and I write notes as I go.",
  aboutZh: "这是一个占位段落：替换于 src/content/profile.ts。",
  location: null,
} satisfies Profile & { aboutZh: string };
