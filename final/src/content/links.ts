import type { Links } from "./types";

/** CONTENT_PACK §links — channels are null until they exist; null channels
 *  are hidden, never faked. Real Content & Cases pass: the public GitHub
 *  profile is confirmed and listed; email and academic identifiers stay
 *  null (not provided). */
export const links = {
  email: null,
  github: "https://github.com/HrrY1n",
  scholar: null,
  orcid: null,
  linkedin: null,
  rss: null,
} satisfies Links;
