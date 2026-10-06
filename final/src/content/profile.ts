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
  // Same statement as `about`, in Chinese — research focus only, no
  // biographical facts, so it stays honest while `name` is still null.
  aboutZh:
    "计算机科学研究生。我研究检索增强生成——让语言模型的回答建立在可检索的证据之上，" +
    "以及当这些证据有噪声、彼此冲突或被刻意投毒时，系统会发生什么。" +
    "我把这些失效模式做成可在浏览器里运行的小工具，让问题可以被亲眼看到。",
  location: null,
} satisfies Profile & { aboutZh: string };
