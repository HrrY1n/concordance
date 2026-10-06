import type { Links } from "./types";

/** CONTENT_PACK §links — every channel is null until a real one exists.
 *  Null channels are hidden, never faked; when ALL are null the Connect page
 *  shows its action-oriented empty state plus one explicit mailto slot. */
export const links = {
  email: null,
  github: null,
  scholar: null,
  orcid: null,
  linkedin: null,
  rss: null,
} satisfies Links;
