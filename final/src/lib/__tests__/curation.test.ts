import { describe, expect, it } from "vitest";
import { pickLeadPlate, plateNumberOf } from "../curation";
import type { Project } from "@/content/types";

const project = (over: Partial<Project>): Project => ({
  id: "p",
  title: "P",
  summary: "",
  year: 2026,
  role: "",
  kind: "tool",
  tags: [],
  status: null,
  links: { github: null, demo: null, writeup: null },
  featured: true,
  sample: false,
  ...over,
});

describe("pickLeadPlate (homepage honesty)", () => {
  it("prefers a real featured project over sample ones", () => {
    const projects = [
      project({ id: "sample-one", sample: true }),
      project({ id: "real-one", sample: false }),
    ];
    expect(pickLeadPlate(projects)?.id).toBe("real-one");
  });

  it("falls back to a sample plate only when nothing real is featured", () => {
    const projects = [project({ id: "sample-one", sample: true, featured: false }), project({ id: "sample-two", sample: true })];
    expect(pickLeadPlate(projects)?.id).toBe("sample-two");
  });

  it("returns undefined when there are no featured projects", () => {
    expect(pickLeadPlate([project({ featured: false })])).toBeUndefined();
  });

  it("cites the plate's real work-page number", () => {
    const projects = [
      project({ id: "a", sample: true }),
      project({ id: "b", sample: true }),
      project({ id: "c", sample: true }),
      project({ id: "real", sample: false }),
    ];
    const lead = pickLeadPlate(projects);
    expect(plateNumberOf(lead, projects)).toBe(4);
  });
});
