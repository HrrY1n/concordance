import type { Profile } from "./types";

export const profile: Profile = {
  name: null,
  identity: ["Computer Science", "Research × Engineering"],
  about:
    "Graduate student in computer science. I work on retrieval-augmented generation — " +
    "LLM systems that ground their answers in retrieved evidence, and what happens when " +
    "that evidence is noisy, conflicting, or deliberately poisoned. I build tools to make " +
    "those failure modes visible, and I write notes as I go. / 这是一个占位段落：替换于 src/content/profile.ts。",
  location: null,
};

/** The English body (before the " / " separator) — used as the hero lede. */
export const aboutEn = profile.about.split(" / ")[0] ?? profile.about;
/** The trailing placeholder sentence — kept visible as the CJK rendering self-check. */
export const aboutNote = profile.about.split(" / ")[1] ?? "";
