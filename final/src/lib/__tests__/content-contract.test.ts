import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { DEMO_IDS, DEMO_REGISTRY, ROUTE_PATHS, TOPIC_IDS } from "@/content/ids";
import { cases, caseBySlug } from "@/content/cases";
import { notes } from "@/content/notes";
import { projects, chains } from "@/content/projects";
import { publications } from "@/content/publications";
import { profile } from "@/content/profile";
import { researchQuestions, researchTopics } from "@/content/research";
import { timeline } from "@/content/timeline";
import { links } from "@/content/links";
import { budgetChunks, sandboxCorpus } from "@/content/lab";
import { buildIndex, queryRecords } from "@/lib/search";
import { colophonHonesty, sections } from "@/lib/sections";

describe("content contract", () => {
  it("no sample entries remain anywhere in visitor-visible data", () => {
    for (const p of projects) expect(p.sample, `project ${p.id}`).toBe(false);
    for (const n of notes) expect(n.sample, `note ${n.id}`).toBe(false);
    for (const t of timeline) expect(t.sample, `timeline ${t.title}`).toBe(false);
    for (const q of researchQuestions) expect(q.sample, `question ${q.id}`).toBe(false);
    expect(colophonHonesty).toContain("全站正式条目均有据可查");
  });

  it("every project is real work: a public repository, no invented résumé", () => {
    for (const p of projects) {
      expect(p.links.github, `${p.id} carries its public repo`).toMatch(
        /^https:\/\/github\.com\/HrrY1n\/[A-Za-z0-9-]+$/,
      );
      expect(p.role).not.toContain("TODO");
    }
    const ids = projects.map((p) => p.id);
    for (const ghost of ["retrieval-lens", "robust-eval-kit", "poison-sandbox"]) {
      expect(ids, `fabricated entry ${ghost} stays out`).not.toContain(ghost);
    }
  });

  it("evidence chains cite only artifacts that exist", () => {
    for (const p of projects) {
      const chain = chains[p.id as keyof typeof chains];
      expect(chain).toBeTruthy();
      expect(chain.problem.length).toBeGreaterThan(10);
      expect(chain.method.length).toBeGreaterThan(0);
      expect(chain.artifacts.length).toBeGreaterThan(0);
      const serialized = JSON.stringify(chain);
      expect(serialized).not.toMatch(/private|no public release/i);
    }
  });

  it("case studies map to real projects; slugs are unique and route-consistent", () => {
    const slugs = cases.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    const projectIds = projects.map((p) => p.id);
    for (const c of cases) {
      expect(projectIds, `case ${c.slug} needs its project`).toContain(c.projectId);
      expect(c.summary.length).toBeGreaterThan(20);
      expect(c.sections.length).toBeGreaterThanOrEqual(3);
      expect(c.repoUrl).toMatch(/^https:\/\/github\.com\/HrrY1n\//);
      expect(c.references.length).toBeGreaterThanOrEqual(1);
    }
    expect(caseBySlug("item-storage-app")?.slug).toBe("item-storage-app");
    expect(caseBySlug("soundisle")?.slug).toBe("soundisle");
    expect(caseBySlug("does-not-exist")).toBeUndefined();
  });

  it("every case figure is a real asset shipped under public/cases/<slug>/", () => {
    const publicDir = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..", "public", "cases");
    for (const c of cases) {
      const figures = [c.hero, ...c.sections.flatMap((s) => s.figures ?? [])];
      expect(figures.length, `case ${c.slug} needs visual evidence`).toBeGreaterThanOrEqual(3);
      for (const f of figures) {
        expect(f.alt.length, `figure ${f.file} needs alt text`).toBeGreaterThan(10);
        const path = join(publicDir, c.slug, f.file);
        expect(() => readFileSync(path), `missing asset ${path}`).not.toThrow();
      }
    }
  });

  it("no developer paths or TODOs leak — scan includes chains, cases, lab data, links", () => {
    const exported = JSON.stringify({
      profile,
      timeline,
      projects,
      chains,
      cases,
      notes,
      researchTopics,
      researchQuestions,
      publications,
      budgetChunks,
      sandboxCorpus,
      links,
    });
    expect(exported).not.toMatch(/TODO/i);
    expect(exported).not.toContain("src/content");
    expect(exported).not.toContain("Replace in");
    expect(exported).not.toMatch(/C:\\\\|D:\\\\|\/Users\/|\/home\//);
  });

  it("the colophon honesty line reflects the sample state and carries no paths", () => {
    const anySample = [...researchQuestions, ...notes, ...projects, ...timeline].some(
      (e) => e.sample === true,
    );
    if (anySample) {
      expect(colophonHonesty).toContain("sample");
      expect(colophonHonesty).not.toContain("src/content");
    } else {
      expect(colophonHonesty).toContain("全站正式条目均有据可查");
    }
  });

  it("identity: no legal name or location is published; the handle is the only signature", () => {
    expect(profile.name).toBeNull();
    expect(profile.location).toBeNull();
    expect(profile.handle).toMatch(/^[A-Za-z0-9-]+$/);
  });

  it("links: the confirmed GitHub profile is on, and matches the handle; email stays null", () => {
    expect(links.github).toBe(`https://github.com/${profile.handle}`);
    expect(links.email).toBeNull();
    expect(links.scholar).toBeNull();
    expect(links.orcid).toBeNull();
    expect(links.linkedin).toBeNull();
  });

  it("researchQuestions is the honest empty ledger (sample questions were removed, not promoted)", () => {
    expect(researchQuestions).toHaveLength(0);
  });

  it("publications is empty — the empty state is a first-class page", () => {
    expect(publications).toHaveLength(0);
  });

  it("every question's topic and demo reference exist", () => {
    for (const q of researchQuestions) {
      expect(TOPIC_IDS).toContain(q.topic);
      if (q.relatedDemo) {
        expect(DEMO_IDS).toContain(q.relatedDemo);
        expect(DEMO_REGISTRY[q.relatedDemo]).toBeTruthy();
      }
    }
  });

  it("every topic's adjoins reference real topics; demo refs are runnable", () => {
    for (const t of researchTopics) {
      for (const a of t.adjoins) expect(TOPIC_IDS).toContain(a);
      if (t.relatedDemo) expect(DEMO_REGISTRY[t.relatedDemo]).toBeTruthy();
    }
  });

  it("sidenote numbers are unique per note and bodies are well-formed", () => {
    for (const n of notes) {
      const nums = (n.body ?? [])
        .map((b) => (b.type === "p" && b.sidenote ? b.sidenote.n : null))
        .filter((x): x is number => x !== null);
      expect(new Set(nums).size).toBe(nums.length);
      for (const b of n.body ?? []) {
        if (b.type === "code") expect(b.text.length).toBeGreaterThan(0);
      }
    }
  });

  it("sandbox corpus: exactly one poisoned doc, all docs unique ids; chunk sources cite no removed notes", () => {
    const poisoned = sandboxCorpus.filter((d) => d.poisoned);
    expect(poisoned).toHaveLength(1);
    expect(new Set(sandboxCorpus.map((d) => d.id)).size).toBe(sandboxCorpus.length);
    for (const c of budgetChunks) {
      expect(c.text.length).toBeGreaterThan(0);
      expect(c.source).not.toMatch(/note n\d/i);
    }
  });
});

describe("palette index", () => {
  it("indexes every route section plus home, with coordinates", () => {
    const index = buildIndex();
    for (const s of sections) {
      const rec = index.find((r) => r.route === s.route && r.type === "PAGE");
      expect(rec, `missing page record for ${s.route}`).toBeTruthy();
      expect(rec?.coord).toBe(`§${s.num}`);
    }
    expect(index.some((r) => r.route === "/" && r.type === "PAGE")).toBe(true);
  });

  it("indexes demos, projects, cases, topics, questions and notes", () => {
    const index = buildIndex();
    expect(index.filter((r) => r.type === "DEMO")).toHaveLength(DEMO_IDS.length);
    expect(index.filter((r) => r.type === "PROJECT")).toHaveLength(projects.length);
    expect(index.filter((r) => r.type === "CASE")).toHaveLength(cases.length);
    expect(index.filter((r) => r.type === "TOPIC")).toHaveLength(researchTopics.length);
    expect(index.filter((r) => r.type === "QUESTION")).toHaveLength(researchQuestions.length);
    expect(index.filter((r) => r.type === "NOTE")).toHaveLength(notes.length);
  });

  it("case records deep-link to /work/:slug and the search finds them", () => {
    const index = buildIndex();
    for (const c of cases) {
      expect(index.find((r) => r.id === `case-${c.slug}`)?.route).toBe(`/work/${c.slug}`);
    }
    expect(queryRecords(index, "local-first").some((r) => r.type === "CASE")).toBe(true);
    expect(queryRecords(index, "web audio").some((r) => r.type === "CASE")).toBe(true);
    expect(queryRecords(index, "投毒").length).toBeGreaterThan(0);
  });

  it("note records deep-link to /notes/:slug; all routes are known routes", () => {
    const index = buildIndex();
    for (const rec of index) {
      if (rec.route === "") continue;
      const known =
        (ROUTE_PATHS as readonly string[]).includes(rec.route) ||
        /^\/notes\/[a-z0-9-]+$/.test(rec.route) ||
        /^\/work\/[a-z0-9-]+$/.test(rec.route);
      expect(known, `record ${rec.id} has unknown route ${rec.route}`).toBe(true);
    }
    expect(index.find((r) => r.id === "note-archive-as-instrument")?.route).toBe(
      "/notes/archive-as-instrument",
    );
  });

  it("returns no results for gibberish, and sane results for real queries", () => {
    const index = buildIndex();
    expect(queryRecords(index, "qqqqzzzz")).toHaveLength(0);
    expect(queryRecords(index, "poisoning")[0]?.id).toBeTruthy();
    expect(queryRecords(index, "投毒")[0]?.id).toBeTruthy();
    const empty = queryRecords(index, "");
    expect(empty[0]?.type).toBe("PAGE");
  });
});
