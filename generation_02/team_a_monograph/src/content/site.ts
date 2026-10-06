import type { SiteContent } from "./types";

// sample: true — editorial voice of the monograph; replace in this file.
export const site: SiteContent = {
  title: "Monograph — Retrieval · Robustness · Security",
  description:
    "The working monograph of a graduate student in computer science: retrieval-augmented generation, its robustness, knowledge poisoning, and the security of the retrieval–generation loop.",
  url: "https://example.com/",
  wordmark: "Monograph",
  heroTag: "Retrieval · Robustness · Security",
  heroSans: ["Retrieval-Augmented", "Generation,"],
  heroSerif: "before it breaks.",
  heroLedeFromAbout: true,
  connectIntro:
    "The correspondence page. Channels are listed here as they exist — nothing on this page is staged.",
  connectEmptyLine: "No channels are configured yet.",
  labIntro:
    "Small, offline instruments for the ideas in §02. No backend, no GPU: every demo ships its data and runs where you read it.",
  labHonesty:
    "Illustrative toy — lexical scoring on a hand-written corpus. Not a claim about real systems.",
  colophonLegend:
    "The dot marks what is alive: the chapter you are reading, work still running, poisoned evidence, keyboard focus.",
  sample: true,
};
