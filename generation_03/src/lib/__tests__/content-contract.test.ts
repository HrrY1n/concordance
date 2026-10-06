import { describe, expect, it } from "vitest";
import { DEMO_IDS, DEMO_REGISTRY, ROUTE_PATHS, TOPIC_IDS } from "@/content/ids";
import { notes } from "@/content/notes";
import { projects, chains } from "@/content/projects";
import { publications } from "@/content/publications";
import { profile } from "@/content/profile";
import { researchQuestions, researchTopics } from "@/content/research";
import { timeline } from "@/content/timeline";
import { links } from "@/content/links";
import { budgetChunks, sandboxCorpus } from "@/content/lab";
import { buildIndex, queryRecords } from "@/lib/search";
import { sections } from "@/lib/sections";

/**
 * Content-contract tests (§4 / D3's runtime complement): the compile-time
 * whitelist unions catch typos in cross-references; these tests assert the
 * honesty and completeness properties the components rely on.
 */
describe("content contract", () => {
  it("sample data is flagged; the only unflagged project is this site", () => {
    for (const q of researchQuestions) expect(q.sample).toBe(true);
    for (const n of notes) expect(n.sample).toBe(true);
    for (const t of timeline) expect(t.sample).toBe(true);
    for (const p of projects) {
      if (p.id !== "this-site") expect(p.sample).toBe(true);
      else expect(p.sample).toBe(false);
    }
  });

  it("profile claims nothing personal: name/location are null", () => {
    expect(profile.name).toBeNull();
    expect(profile.location).toBeNull();
  });

  it("links are all null until real ones exist (UI hides nulls)", () => {
    for (const value of Object.values(links)) expect(value).toBeNull();
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

  it("every project has an evidence chain (compile-time Record, runtime check)", () => {
    for (const p of projects) {
      const chain = chains[p.id as keyof typeof chains];
      expect(chain).toBeTruthy();
      expect(chain.problem.length).toBeGreaterThan(10);
      expect(chain.method.length).toBeGreaterThan(0);
      expect(chain.artifacts.length).toBeGreaterThan(0);
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

  it("sandbox corpus: exactly one poisoned doc, all docs unique ids", () => {
    const poisoned = sandboxCorpus.filter((d) => d.poisoned);
    expect(poisoned).toHaveLength(1);
    expect(new Set(sandboxCorpus.map((d) => d.id)).size).toBe(sandboxCorpus.length);
    for (const c of budgetChunks) expect(c.text.length).toBeGreaterThan(0);
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

  it("indexes demos, projects, topics, questions and notes", () => {
    const index = buildIndex();
    expect(index.filter((r) => r.type === "DEMO")).toHaveLength(DEMO_IDS.length);
    expect(index.filter((r) => r.type === "PROJECT")).toHaveLength(projects.length);
    expect(index.filter((r) => r.type === "TOPIC")).toHaveLength(researchTopics.length);
    expect(index.filter((r) => r.type === "QUESTION")).toHaveLength(researchQuestions.length);
    expect(index.filter((r) => r.type === "NOTE")).toHaveLength(notes.length);
  });

  it("note records deep-link to /notes/:slug; all routes are known routes", () => {
    const index = buildIndex();
    for (const rec of index) {
      if (rec.route === "") continue; // ACTION records
      const known =
        (ROUTE_PATHS as readonly string[]).includes(rec.route) ||
        /^\/notes\/[a-z0-9-]+$/.test(rec.route);
      expect(known, `record ${rec.id} has unknown route ${rec.route}`).toBe(true);
    }
    expect(index.find((r) => r.id === "note-n1")?.route).toBe("/notes/n1");
  });

  it("returns no results for gibberish, and sane results for real queries", () => {
    const index = buildIndex();
    expect(queryRecords(index, "qqqqzzzz")).toHaveLength(0);
    expect(queryRecords(index, "poisoning")[0]?.id).toBeTruthy();
    // Empty query doubles as a menu: pages and actions first.
    const empty = queryRecords(index, "");
    expect(empty[0]?.type).toBe("PAGE");
  });
});
