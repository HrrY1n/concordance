import type { Project } from "@/content/types";

/**
 * Lead-plate selection (placeholder pass): the homepage's flagship Selected
 * Work prefers a REAL featured project — a sample entry must never be
 * presented as the person's primary work. Sample plates only fill in while
 * the archive is unconfigured, and they carry their own "sample entry"
 * readout wherever they render.
 */
export function pickLeadPlate(projects: Project[]): Project | undefined {
  return projects.find((p) => p.featured && !p.sample) ?? projects.find((p) => p.featured);
}

/** The plate's real number on the Work page, so the homepage citation and the
 *  work index can never disagree. */
export function plateNumberOf(project: Project | undefined, projects: Project[]): number {
  const i = project ? projects.indexOf(project) : -1;
  return i >= 0 ? i + 1 : 1;
}
