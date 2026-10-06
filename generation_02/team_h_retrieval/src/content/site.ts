/**
 * Site-level config: the retrieval-system frame around CONTENT_PACK data.
 * Nothing here invents a credential — the headline is a direction statement,
 * the self-query is the hero device's fixed query, and every count shown in
 * the UI is derived from the content modules at render time (honest readings).
 */
export const site = {
  title: "A Retrievable Self",
  domain: "https://example.com",
  /** The hero's fixed self-query. The visitor never has to type anything. */
  selfQuery: "who is this person?",
  /** Direction statement — same line as generation 1; it is the site's voice. */
  headline: "Retrieval, robustness, and the systems in between.",
  /** Topic ids surfaced as the four hero facets, in reveal order. */
  facetIds: ["rag", "robustness", "poisoning", "llm-systems"],
  wordmark: "⌕",
  /**
   * Metaphor budget (round-1 product judge: needs lint-level enforcement).
   * Retrieval *poetry* is allowed at exactly these touchpoints; everywhere
   * else the site speaks like a well-typeset page, not a theme park.
   */
  metaphorTouchpoints: ["hero self-query block", "search palette", "lab readings"] as const,
};
