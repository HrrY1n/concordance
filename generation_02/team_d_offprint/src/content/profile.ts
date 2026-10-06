import type { HeroContent, Profile } from "./types";

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

/**
 * Hero copy is composed from the profile material above — a re-phrasing of
 * the about statement, not a new claim. Replace here when profile changes.
 */
export const hero: HeroContent = {
  edition: "Working edition",
  stance: "Grounded answers, studied where they break.",
  lede:
    "I work on retrieval-augmented generation — LLM systems that ground their answers " +
    "in retrieved evidence, and what happens when that evidence is noisy, conflicting, " +
    "or deliberately poisoned.",
  contactNote: "Available on request.",
};
