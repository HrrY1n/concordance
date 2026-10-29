import type { Project } from "./types";

/**
 * CONTENT_PACK §projects — three entries, all real and all with verifiable
 * public repos (Real Content & Cases pass). The sample résumé entries were
 * removed, not renamed: nothing here claims work the repositories don't show.
 * Order is the display order; the first real featured project leads the
 * homepage plate (lib/curation.ts).
 */
export const projects = [
  {
    id: "item-storage-app",
    sample: false,
    featured: true,
    year: 2026,
    kind: "tool",
    title: "Private Item Library",
    summary:
      "A local-first PWA for cataloguing the things you own — categories, lifecycle, " +
      "holding cost and warranty — stored on-device in IndexedDB, with checksummed ZIP " +
      "backups and an optional recovery-code sync. Offline is the default, not a mode.",
    role: "Solo — design, engineering, docs",
    status: "active",
    tags: ["React", "TypeScript", "Dexie", "IndexedDB", "PWA"],
    links: {
      github: "https://github.com/HrrY1n/item-storage-app",
      demo: null,
      writeup: null,
    },
  },
  {
    id: "soundisle",
    sample: false,
    featured: true,
    year: 2026,
    kind: "tool",
    title: "SoundIsle · 声屿",
    summary:
      "A focus workbench synthesized entirely in the browser: Web Audio channels rendered " +
      "from nodes instead of samples, a Canvas night-sea scene that breathes with the mix, " +
      "and a focus timer. Zero audio assets shipped.",
    role: "Solo — design, engineering, docs",
    status: "maintained",
    tags: ["Web Audio", "Canvas", "TypeScript", "Creative coding"],
    links: {
      github: "https://github.com/HrrY1n/soundisle",
      demo: null,
      writeup: null,
    },
  },
  {
    id: "this-site",
    sample: false,
    featured: true,
    year: 2026,
    kind: "site",
    title: "Concordance",
    summary:
      "A data-driven personal archive: content as typed TypeScript, readings derived from " +
      "the data, figures computed in the visitor's browser — designed to grow for years " +
      "without a redesign.",
    role: "Designer & engineer",
    status: "active",
    tags: ["TypeScript", "Design Systems"],
    links: {
      github: "https://github.com/HrrY1n/concordance",
      demo: null,
      writeup: null,
    },
  },
] satisfies Project[];

/** extension — evidence chains for the PLATE grammar. `Record<ProjectId, …>`
 *  makes a missing chain a COMPILE ERROR: add a project, and tsc demands its
 *  evidence chain too (§4 / D3). Every line below is checkable against the
 *  linked public repository. */
export type ProjectId = (typeof projects)[number]["id"];

export interface EvidenceChain {
  problem: string; // one question-shaped sentence
  method: string[]; // verb-first mono lines
  artifacts: string[]; // only things that exist
}

export const chains: Record<ProjectId, EvidenceChain> = {
  "item-storage-app": {
    problem:
      "How should personal inventory data survive device loss, offline use, and schema change — without a required backend?",
    method: [
      "store everything on-device in indexeddb via dexie",
      "version the schema and test each migration",
      "export and restore checksummed zip backups",
      "pair devices for sync only through an explicit recovery code",
    ],
    artifacts: [
      "github.com/HrrY1n/item-storage-app",
      "vitest suite over migrations, repositories, backup and sync (fake-indexeddb)",
      "interface record — 14 screenshots with capture provenance in the repo docs",
    ],
  },
  soundisle: {
    problem:
      "Can a focus environment ship with zero audio assets and still feel alive?",
    method: [
      "synthesize every channel from web audio nodes — no samples",
      "couple the canvas scene to the live mix, not to a recording",
      "crossfade loop seams and respect the suspended audio state",
      "test the engine and the state it drives",
    ],
    artifacts: [
      "github.com/HrrY1n/soundisle",
      "unit tests over the engine and its state",
      "design iteration log in the repo docs",
    ],
  },
  "this-site": {
    problem: "Can a personal archive grow for years without a redesign?",
    method: [
      "type the content, not the pages",
      "derive every reading from the data files",
      "compute every figure in the visitor's browser",
    ],
    artifacts: [
      "this site",
      "the content contract — typed content files, checked by the test suite",
      "engine tests in src/lib/__tests__/",
    ],
  },
};
