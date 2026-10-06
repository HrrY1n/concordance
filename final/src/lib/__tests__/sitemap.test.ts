import { describe, expect, it } from "vitest";
import { sitemapPaths, sitemapUrls } from "../sitemap";
import { notes } from "@/content/notes";
import { site } from "@/content/site";

/** P1-18 guard: the sitemap is derived, so it can never drift from content. */
describe("sitemap contract", () => {
  it("contains exactly one URL per note, derived from notes.ts", () => {
    const noteUrls = sitemapUrls().filter((u) => u.includes("/notes/"));
    expect(noteUrls).toHaveLength(notes.length);
    for (const note of notes) {
      expect(noteUrls.filter((u) => u.endsWith(`/notes/${note.id}`))).toHaveLength(1);
    }
  });

  it("covers every static route", () => {
    for (const route of [
      "/",
      "/research",
      "/work",
      "/lab",
      "/lab/corruption-sandbox",
      "/notes",
      "/publications",
      "/about",
      "/connect",
    ]) {
      expect(sitemapPaths()).toContain(route);
    }
  });

  it("emits absolute URLs on the configured site origin, no undefined", () => {
    for (const url of sitemapUrls()) {
      expect(url.startsWith(site.url)).toBe(true);
      expect(url).not.toContain("undefined");
    }
  });
});
