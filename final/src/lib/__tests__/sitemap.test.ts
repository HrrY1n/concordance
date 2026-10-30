import { describe, expect, it } from "vitest";
import { routeHead, sitemapPaths, sitemapUrls } from "../sitemap";
import { cases } from "@/content/cases";
import { notes } from "@/content/notes";
import { site, titleSuffix } from "@/content/site";

/** 站点地图单源派生与深度路由元数据断言 */
describe("sitemap contract", () => {
  it("contains exactly one URL per note, derived from notes.ts", () => {
    const noteUrls = sitemapUrls().filter((u) => u.includes("/notes/"));
    expect(noteUrls).toHaveLength(notes.length);
    for (const note of notes) {
      expect(noteUrls.filter((u) => u.endsWith(`/notes/${note.id}`))).toHaveLength(1);
    }
  });

  it("contains exactly one URL per case study, derived from cases.ts", () => {
    const caseUrls = sitemapUrls().filter((u) => u.includes("/work/"));
    expect(caseUrls).toHaveLength(cases.length);
    for (const c of cases) {
      expect(caseUrls.filter((u) => u.endsWith(`/work/${c.slug}`))).toHaveLength(1);
    }
  });

  it("removed sample content is gone from the sitemap", () => {
    const paths = sitemapPaths().join(" ");
    expect(paths).not.toMatch(/notes\/n[123]/);
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

describe("route head metadata (Chinese-first)", () => {
  it("home keeps the archive title; section pages get the suffix grammar", () => {
    expect(routeHead("/").title).toMatch(/Concordance/);
    expect(routeHead("/research").title).toBe(`研究方向体系 — ${titleSuffix}`);
    expect(routeHead("/research").canonical).toBe(`${site.url}research`);
  });

  it("case pages carry the product title and their own summary + canonical", () => {
    for (const c of cases) {
      const head = routeHead(`/work/${c.slug}`);
      expect(head.title).toContain(c.title);
      expect(head.description).toBe(c.summary);
      expect(head.canonical).toBe(`${site.url}work/${c.slug}`);
    }
  });

  it("note pages carry the note title", () => {
    for (const n of notes) {
      expect(routeHead(`/notes/${n.id}`).title).toContain(n.title);
    }
  });

  it("every static route has a specific head (no bare-brand fallback)", () => {
    for (const path of sitemapPaths()) {
      const head = routeHead(path);
      expect(head.title, `route ${path} needs a specific title`).not.toBe("Concordance");
      expect(head.description.length).toBeGreaterThan(15);
    }
  });

  it("unknown deep paths still produce a sane, absolute head", () => {
    const head = routeHead("/work/ghost");
    expect(head.canonical).toBe(`${site.url}work/ghost`);
    expect(head.title).toContain("Concordance");
  });
});
