import type { ProjectId } from "./projects";

/**
 * CONTENT_PACK §cases (Real Content & Cases pass) — long-form case studies
 * behind §02's plates. One template (pages/CasePage.tsx) renders every case;
 * this file is the whole content surface. Rules the type system enforces:
 *   - `projectId` is a ProjectId: a case cannot exist without a real project.
 *   - `sections` are free-form prose blocks — the narrative may differ per
 *     case; the template never forces equal-height sections.
 * Honesty rules:
 *   - every number/claim must be checkable in the linked public repo;
 *   - figures are REAL captures of the running app (provenance recorded per
 *     case) — no mockups, no retouched UI, no invented metrics;
 *   - no live-demo link exists unless a working public URL exists.
 */

export interface CaseFigure {
  /** File name under public/cases/<slug>/ — the component prefixes BASE_URL. */
  file: string;
  alt: string;
  caption: string;
  /** "half" images render two-up on desktop; default is a full-measure plate. */
  variant?: "half";
  /** Intrinsic pixel size — set as width/height so the browser reserves
   *  space before the PNG loads (CLS guard, release-candidate review). */
  w: number;
  h: number;
}

export interface CaseSection {
  heading: string;
  body: string[];
  figures?: CaseFigure[];
}

export interface CaseReference {
  label: string;
  href: string;
  note?: string;
}

export interface CaseStudy {
  slug: string;
  projectId: ProjectId;
  /** Display title — the product's real name. */
  title: string;
  kicker: string;
  /** One-line summary — meta description and Work-page teaser. */
  summary: string;
  role: string;
  year: number;
  status: string;
  stack: string[];
  repoUrl: string;
  hero: CaseFigure;
  sections: CaseSection[];
  references: CaseReference[];
  /** How the visual evidence was captured — printed under the hero. */
  provenance: string;
}

export const cases: CaseStudy[] = [
  {
    slug: "item-storage-app",
    projectId: "item-storage-app",
    title: "Private Item Library",
    kicker: "local-first inventory PWA",
    summary:
      "Case study — Private Item Library: a local-first personal-inventory PWA on Dexie/IndexedDB, with tested migrations, checksummed ZIP backups and recovery-code sync.",
    role: "Solo — product design, engineering, docs",
    year: 2026,
    status: "active · v0.1.0",
    stack: ["React 19", "TypeScript", "Dexie 4 · IndexedDB", "Vite 7", "PWA", "Cloudflare Workers (optional sync)"],
    repoUrl: "https://github.com/HrrY1n/item-storage-app",
    hero: {
      file: "09-desktop-home-light.png",
      alt: "Private Item Library desktop overview: sidebar navigation, item grid with icons, holding-cost summary and warranty reminders.",
      caption: "Desktop overview (1440×1000): sidebar, wide-screen summary, item grid.",
      w: 1440,
      h: 1000,
    },
    provenance:
      "All interface captures come from the project's own recorded set — docs/screenshots/current/, captured 2026-10-19 in an isolated browser with demo data (390×844 @2× mobile, 1440×1000 desktop). No private data appears anywhere.",
    sections: [
      {
        heading: "Problem",
        body: [
          "Personal inventory is the kind of data every cloud service wants to hold for you: what you own, what it cost, when the warranty dies. Handing that list to an account also means the list stops working when the network does, and dies when the service does. The question this product answers is narrower and harder: can one person's inventory live entirely on their devices, survive device loss through backups they control, and still sync between machines — without a required backend?",
        ],
      },
      {
        heading: "Design decisions",
        body: [
          "Local-first is the product, not a feature toggle. Everything — browsing, editing, cost math, warranty tracking — works offline; cloud sync is an optional extra paired through an explicit recovery code, never a prerequisite.",
          "The data model follows an object's real life: wish → owned → disposed, with disposal recorded as sold, discarded or other. Cost tracking is honest about money already spent: purchase price plus extra costs rolls up into total invested, actual holding cost and a daily cost — the numbers a decision actually needs, not a single grand total.",
          "Warranty status is always visible as a dot-matrix progress line on the card — remaining time and percentage render even when a deadline can't be computed, showing just the expiry instead of an empty widget. And the icon system is curated rather than crowdsourced: 220 transparent 768×768 illustrations, nine browse categories, Chinese/English/alias search, one asset set shared by both themes.",
        ],
        figures: [
          {
            file: "01-home-light.png",
            alt: "Mobile overview: total invested, holding and category counts, daily cost, warranty alerts and recently added items.",
            caption: "Mobile overview — money answers first: invested, holding cost, daily cost.",
            variant: "half",
            w: 780,
            h: 1688,
          },
          {
            file: "03-detail-light.png",
            alt: "Item detail page: purchase information, cost breakdown, warranty tracking with progress.",
            caption: "Item detail — purchase, cost and warranty in one record.",
            variant: "half",
            w: 780,
            h: 1688,
          },
        ],
      },
      {
        heading: "Engineering",
        body: [
          "State lives in Dexie over IndexedDB, exposed to React through dexie-react-hooks — queries are live by construction, and the schema is versioned. Every migration is unit-tested (fake-indexeddb in the test harness), because a schema change that silently loses rows is the one bug a local-first app can never ship.",
          "Durability has a user-facing surface: export and restore of checksummed ZIP backups (business data plus user assets) built on JSZip. The optional sync pairs devices through a recovery code and treats the local store as the source of truth — the client decides when anything is pushed or pulled, and nothing syncs until the user turns it on.",
          "As a PWA it installs to the home screen and updates safely: a new deploy is detected by the service worker, in-progress edits are preserved, and the refresh waits until the running operation completes. The data layer — migrations, repositories, backup, sync — is covered by a Vitest suite run against fake-indexeddb, so the tests exercise real query semantics rather than mocks of them.",
        ],
        figures: [
          {
            file: "05-icon-picker-light.png",
            alt: "Icon picker: nine categories, three-column category cards and global search, light theme.",
            caption: "The icon library, browsable by category and searchable.",
            variant: "half",
            w: 780,
            h: 1688,
          },
          {
            file: "08-home-dark.png",
            alt: "Dark-theme overview: the same transparent icon assets and clear reading hierarchy.",
            caption: "Dark theme — one transparent asset set, both ink systems.",
            variant: "half",
            w: 780,
            h: 1688,
          },
        ],
      },
      {
        heading: "Evidence",
        body: [
          "The repository carries the product docs, the test suite and a recorded interface set with capture provenance written into the README (isolated browser, demo data, dated). What the case claims above maps to code: migrations in src/db/migration*.test.ts, backup in src/services/backupService.ts, the update flow in src/services/pwaUpdate.ts, sync in src/services/syncService.ts.",
        ],
        figures: [
          {
            file: "02-items-light.png",
            alt: "Item list: independently expandable cost details, dot-matrix warranty always visible.",
            caption: "Item list — cost details expand independently; warranty is never hidden.",
            variant: "half",
            w: 780,
            h: 1688,
          },
          {
            file: "10-desktop-detail-dark.png",
            alt: "Desktop item detail, dark theme: two-column layout with wide-screen overview.",
            caption: "Desktop detail, dark — sidebar + wide-screen split layout.",
            variant: "half",
            w: 1440,
            h: 1000,
          },
        ],
      },
      {
        heading: "Reflection",
        body: [
          "Version 0.1.0 is honest about its edges. Sync semantics are deliberately simple — the recovery code pairs devices, and merge behavior favors predictability over cleverness; conflict handling is the next thing worth engineering, not something to claim quietly. The AI-assisted entry (photo or order-screenshot recognition, cropped and confirmed locally before anything saves) is quota-bound by design and pauses when the allowance runs out. The icon library grows by need, not by ambition — the docs say so, and the repo shows it.",
        ],
      },
    ],
    references: [
      { label: "Repository", href: "https://github.com/HrrY1n/item-storage-app", note: "source, tests, docs" },
      {
        label: "AI-assisted entry — design note",
        href: "https://github.com/HrrY1n/item-storage-app/blob/main/docs/ai-recognition.md",
        note: "docs/ai-recognition.md",
      },
      {
        label: "Interface record",
        href: "https://github.com/HrrY1n/item-storage-app/tree/main/docs/screenshots/current",
        note: "docs/screenshots/current/ — dated captures with provenance",
      },
    ],
  },
  {
    slug: "soundisle",
    projectId: "soundisle",
    title: "SoundIsle · 声屿",
    kicker: "zero-asset Web Audio sound garden",
    summary:
      "Case study — SoundIsle (声屿): six ambient channels synthesized from Web Audio nodes with no samples, a Canvas night sea driven by the live mix, and a focus timer — 35 KB of JavaScript.",
    role: "Solo — product design, engineering, docs",
    year: 2026,
    status: "maintained",
    stack: ["TypeScript (strict)", "Web Audio API", "Canvas 2D", "Vite 6", "Vitest"],
    repoUrl: "https://github.com/HrrY1n/soundisle",
    hero: {
      file: "hero-night-sea.png",
      alt: "SoundIsle night scene: moon and stars over dark waves, a 25:00 focus timer, and the six-channel mixer below — rain, fire, wind, stream, crickets, birds.",
      caption: "The night sea at rest: waves tinted by the channels you enabled, timer not yet started.",
      w: 1280,
      h: 800,
    },
    provenance:
      "Captures rendered from the running app (development server, headless Chromium via Edge channel, 2026-10-30) against a documented demo state — the seeded localStorage snapshot is kept beside this case's sources. Audio is mixed off during capture; the scene you see is the scene a visitor gets.",
    sections: [
      {
        heading: "Problem",
        body: [
          "Ambient focus sound usually ships as files: loop a rain recording, crossfade, hope the seam hides. The loops click, the downloads weigh, and the scene never responds to what you actually hear. SoundIsle bets the other way — a focus workbench with zero audio assets, where every channel is synthesized from oscillators and filtered noise at runtime, and the visual scene is driven by the live mix rather than by a recording of it.",
        ],
      },
      {
        heading: "Design decisions",
        body: [
          "Six channels — rain, fire, wind, stream, night crickets, birdsong — each built from a synthesis recipe, not a sample: rain is filtered noise with discrete droplet voices and a distant thunder layer; fire is brown noise with a slow LFO and band-passed crackle events; wind is shaped pink noise swept by two slow LFOs. Scrollytelling was rejected on purpose: the whole tool is one screen — timer, scene, mixer — because a focus tool that asks you to scroll is already losing.",
          "The scene earns its place by being evidence. Each wave layer binds to the channels you enabled and draws its amplitude from that channel's live spectrum — mute the mix and the sea dims to 38% and goes still. The mixer is the composition surface: scene presets (雨夜阅读, 炉火冬夜, 森林清晨, 夏夜庭院) are just named starting points, and every slider state persists.",
        ],
        figures: [
          {
            file: "mix-hearth.png",
            alt: "A multi-channel mix: hearth, wind and crickets enabled — wave layers tinted by channel hues, ember and firefly particles visible.",
            caption: "Mix as landscape — wave color and motion follow the enabled channels.",
            variant: "half",
            w: 1280,
            h: 800,
          },
          {
            file: "morning-light.png",
            alt: "Light theme: the same scene in morning colors.",
            caption: "Light theme — same engine, different ink.",
            variant: "half",
            w: 1280,
            h: 800,
          },
        ],
      },
      {
        heading: "Engineering",
        body: [
          "The audio graph per channel: source → channel gain → high-pass (24 Hz) → low-pass (9 kHz) → compressor → analyser, with per-channel taps feeding the scene. Loop seams — the classic synthesized-ambience artifact — are handled by a noise factory that removes DC offset and crossfades 60 ms around the seam. Autoplay policy is respected as a state, not an afterthought: the context starts suspended and the interface says so until a gesture wakes it.",
          "The focus timer anchors elapsed time to Date.now() instead of tick counts, so a throttled background tab cannot drift it; modes are 25/5, 50/10, 90/15 and a custom range, with an SVG progress ring, an FM-chime voice for transitions and a title-bar countdown. Persistence is one debounced localStorage key with a corrupted-state fallback. The measured cost of all of it: 35 KB of JavaScript (12 KB gzipped) and one font dependency — no framework, no audio files.",
          "The repo keeps its receipts in an unusual way: a seven-round iteration log plus code review, each round a measurable critique. Round 6 is the honest one — a PCM measurement traced audible clipping to an event voice entering at full scale (rain hit −10 dBFS); the fix lands the channel at −34.2 dB with zero clipping. The engine's logic — timer, stats, storage, presets — is covered by 32 Vitest cases; the audio graph itself is verified by in-browser waveform and spectrum assertions rather than mocks.",
        ],
      },
      {
        heading: "Evidence",
        body: [
          "Everything above is checkable in the repository: the synthesis recipes and graph are in the audio modules, the scene coupling in the canvas renderer, the iteration log (including the −34.2 dB measurement) in docs, the test suite in the Vitest run. The captures beside this text were rendered from the running app against a documented demo state — no mockups, no retouching.",
        ],
        figures: [
          {
            file: "mobile-375.png",
            alt: "Mobile layout at 375 px: timer and mixer stacked, same scene.",
            caption: "375 px — one screen still means one screen.",
            w: 375,
            h: 667,
          },
        ],
      },
      {
        heading: "Reflection",
        body: [
          "Known limits, kept visible: event voices are scheduled with setTimeout rather than sample-accurate clocks, and background-tab throttling thins event density; there is no reverb and the persistent layers are mono — the loudness balance is hand-tuned, which the round-6 clipping story is a lesson about, not a fix for. Mobile has the standard gesture unlock but no deeper defenses (no media-session integration, no silent unlock). Reduced-motion visitors get a quiet static sea — still, honest, and slightly barer than the animated one.",
        ],
      },
    ],
    references: [
      { label: "Repository", href: "https://github.com/HrrY1n/soundisle", note: "source, tests, iteration log" },
      {
        label: "Design iteration log",
        href: "https://github.com/HrrY1n/soundisle/blob/main/docs/iterations.md",
        note: "seven rounds + code review, with measurements",
      },
    ],
  },
];

export const caseBySlug = (slug: string | undefined): CaseStudy | undefined =>
  cases.find((c) => c.slug === slug);

export const caseByProjectId = (projectId: ProjectId): CaseStudy | undefined =>
  cases.find((c) => c.projectId === projectId);
