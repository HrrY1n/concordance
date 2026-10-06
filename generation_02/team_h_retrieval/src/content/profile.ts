import type { Profile } from "./types";

/**
 * From CONTENT_PACK §profile. `name` is null — no identity is invented.
 * The about string deliberately contains one CJK sentence: it is the standing
 * test case for CJK fallback rendering (GEN2_BRIEF self-check).
 */
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
