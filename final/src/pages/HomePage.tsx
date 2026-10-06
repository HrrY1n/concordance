import { useMemo } from "react";
import { Link } from "react-router-dom";
import { bm25Rank } from "@/lib/bm25";
import { budgetChunks, sandboxCorpus, sandboxQuery, budgetDefault } from "@/content/lab";
import { links } from "@/content/links";
import { notes } from "@/content/notes";
import { projects } from "@/content/projects";
import { publications } from "@/content/publications";
import { researchQuestions, researchTopics } from "@/content/research";
import { site, heroIdentity } from "@/content/site";
import { DEMO_REGISTRY } from "@/content/ids";
import { DEMO_COUNT, sections } from "@/lib/sections";
import { useDocumentMeta } from "@/lib/seo";
import { useSearch } from "@/lib/palette";
import { Figure, Section, XRef } from "@/components/structure";
import { RankList } from "@/components/RankList";

/**
 * §00 HOME — frontispiece + the archive in one scroll. Register composition
 * (M1): PLATE hero → LEDGER research → PLATE work → LEDGER lab → ESSAY notes
 * → PLATE connect. No two neighbors share a register.
 */

const FACET_COUNT = 4;

/* FIG.01 — the site's thesis in one figure: the same query, ranked before and
   after one poisoned document joins the corpus. Computed in your browser. */
function DeltaFigure() {
  const clean = useMemo(
    () => bm25Rank(sandboxCorpus.filter((d) => !d.poisoned), sandboxQuery),
    [],
  );
  const poisoned = useMemo(() => bm25Rank(sandboxCorpus, sandboxQuery), []);
  return (
    <Figure
      id="FIG. 01"
      title="One query, two corpora — the top three"
      method="bm25 (k1 1.5 · b 0.75) · computed in this page · no requests"
    >
      <div className="grid gap-8 sm:grid-cols-2">
        <div>
          {/* the count is derived — never hand-written (P1-16) */}
          <p className="t-meta t-caps text-ink-2">clean corpus — {clean.length} documents</p>
          <div className="mt-3">
            <RankList ranked={clean} top={3} ariaLabel="Top three, clean corpus" />
          </div>
        </div>
        <div>
          <p className="t-meta t-caps text-ink-2">
            after injecting d8 <span className="text-signal">▲ poisoned</span>
          </p>
          <div className="mt-3">
            <RankList ranked={poisoned} top={3} ariaLabel="Top three after injection" />
          </div>
        </div>
      </div>
      <p className="t-small text-ink-2 mt-4 max-w-[62ch]">
        The poisoned passage was written to repeat the query’s own vocabulary, so it takes the top
        slot from passages that genuinely answer the question.{" "}
        <Link
          to="/lab/corruption-sandbox"
          className="u-link inline-flex min-h-[44px] items-center -my-2"
        >
          Reproduce it in the Lab →
        </Link>
      </p>
    </Figure>
  );
}

/* FIG.02 — context fill at the default budget, computed from the chunk data. */
function ContextFillFigure() {
  const budget = budgetDefault;
  const states = budgetChunks.reduce<{ id: string; tokens: number; fits: boolean; used: number }[]>(
    (acc, chunk) => {
      const tokens = Math.ceil(chunk.text.length / 4);
      const usedBefore = acc.length > 0 ? acc[acc.length - 1].used : 0;
      const fits = usedBefore + tokens <= budget;
      acc.push({ id: chunk.id, tokens, fits, used: fits ? usedBefore + tokens : usedBefore });
      return acc;
    },
    [],
  );
  const fitCount = states.filter((s) => s.fits).length;
  const used = states.length > 0 ? states[states.length - 1].used : 0;
  const totalTokens = states.reduce((sum, s) => sum + s.tokens, 0);
  return (
    <Figure
      id="FIG. 02"
      title={`Context fill at ${budget} tok`}
      method="counts = chars ÷ 4 (est.) · computed from lab.ts · offline"
    >
      <div
        className="u-figure flex h-8 w-full border border-line"
        role="img"
        aria-label={`Context budget: ${fitCount} of ${states.length} chunks fit in ${budget} tokens; ${totalTokens - used} tokens of demand are truncated.`}
      >
        {states.map(({ id, tokens, fits }) => (
          <span
            key={id}
            className={fits ? "border-r border-line bg-ink-2/70" : "border-r border-line bg-signal/40"}
            style={{ width: `${(tokens / totalTokens) * 100}%` }}
            title={`${id} — ${tokens} tok est. — ${fits ? "fits" : "truncated"}`}
          />
        ))}
      </div>
      <p className="t-meta text-ink-2 mt-3">
        {fitCount} of {states.length} chunks fit · {used} tok used · {totalTokens - used} tok
        truncated (est.)
      </p>
      <p className="t-small text-ink-2 mt-2 max-w-[62ch]">
        Order decides what fits — which is why reranking is a decision about which evidence exists.{" "}
        <Link to="/lab" className="u-link inline-flex min-h-[44px] items-center -my-2">
          Reorder the queue yourself →
        </Link>
      </p>
    </Figure>
  );
}

export default function HomePage() {
  useDocumentMeta("", site.description);
  const { openSearch } = useSearch();

  const facets = researchTopics.slice(0, FACET_COUNT);
  const featured = projects.filter((p) => p.featured).slice(0, 3);
  const recentNotes = [...notes]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 2);
  // "What is this person working on right now" — derived, never hand-written:
  // the open ledger questions lead the current-work section (P1).
  const activeQuestions = researchQuestions
    .filter((q) => q.status === "active")
    .slice(0, 3);
  const email = links.email;

  // Honest readings — counted from the content modules, never hand-written.
  const readings = [
    `WORK ${projects.length}`,
    `QUESTIONS ${researchQuestions.length}`,
    `NOTES ${notes.length}`,
    `PUBS ${publications.length}`,
  ].join(" · ");

  return (
    <>
      {/* ——— REGISTER PLATE ——— hero: the person first (production pass P1).
           No figure, no system readouts on the first screen — identity, one
           statement, a few retrieval keywords, and 2–3 primary entries. */}
      <section
        aria-labelledby="hero-title"
        data-live="true"
        data-section="home"
        className="wrap flex min-h-[calc(100svh-4rem)] flex-col justify-center pb-14 pt-12 md:pt-16"
      >
        <div className="max-w-[54rem]">
          <p className="t-meta t-caps text-ink-2 settle" style={{ "--settle-i": 0 } as React.CSSProperties}>
            {heroIdentity}
          </p>
          <h1 id="hero-title" className="t-display settle mt-6 max-w-[22ch]" style={{ "--settle-i": 1 } as React.CSSProperties}>
            <span className="block">
              {site.heroSans[0]} {site.heroSans[1]}
            </span>
            <span className="t-serif-voice block text-ink-2">
              {site.heroSerif}
              <span aria-hidden="true" className="caret" />
            </span>
          </h1>
          <p
            className="t-lede text-ink-2 settle mt-7 max-w-[54ch]"
            style={{ "--settle-i": 2 } as React.CSSProperties}
          >
            {site.heroLede}
          </p>

          {/* M3: facets are real retrieval entries — each opens the palette
              pre-queried with the term itself. */}
          <div
            className="mt-8 flex flex-wrap gap-2.5"
            role="group"
            aria-label="Search entries — each opens the site palette with this term"
          >
            {facets.map((f) => (
              <button
                key={f.id}
                type="button"
                className="u-chip"
                onClick={() => openSearch(f.short)}
              >
                {f.short}
                <span aria-hidden="true"> ⌕</span>
              </button>
            ))}
          </div>

          {/* the 2–3 primary entries — addresses, not a system index */}
          <nav aria-label="Primary sections" className="settle mt-10 flex flex-wrap gap-x-8 gap-y-2" style={{ "--settle-i": 3 } as React.CSSProperties}>
            {(["research", "work", "connect"] as const).map((id) => {
              const s = sections.find((x) => x.id === id)!;
              return (
                <Link
                  key={s.id}
                  to={s.route}
                  className="u-link t-small inline-flex min-h-[44px] items-center"
                >
                  <span className="t-meta text-faint mr-2" aria-hidden="true">
                    §{s.num}
                  </span>
                  {s.title}
                </Link>
              );
            })}
          </nav>
        </div>
      </section>

      {/* ——— REGISTER LEDGER ——— research preview: directions, then FIG.01 —
           the first signature moment sits right after the first screen (P1). */}
      <Section
        meta={sections.find((s) => s.id === "research")!}
        register="ledger"
        lede="Six directions, one method: read the pipeline in order — corpus, ranking, generation — and instrument every stage."
      >
        <ul>
          {researchTopics.slice(0, 3).map((t) => (
            <li key={t.id} className="border-b border-line">
              <Link
                to={`/research#${t.id}`}
                className="group grid min-h-[56px] grid-cols-[auto_1fr] items-baseline gap-x-6 gap-y-1 py-4 md:grid-cols-[4rem_16rem_1fr]"
              >
                <span className="t-meta text-accent">{t.short}</span>
                <span className="t-entry text-ink transition-colors group-hover:text-accent">
                  {t.name}
                </span>
                <span className="t-small text-ink-2 max-md:col-start-2">{t.facetLine}</span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="settle mt-10">
          <DeltaFigure />
        </div>
        <div className="mt-6 flex flex-wrap items-baseline justify-between gap-4">
          <p className="t-meta text-ink-2">
            ledger — {researchQuestions.length} questions ·{" "}
            {researchQuestions.filter((q) => q.status === "active").length} active
          </p>
          <XRef to="/research">All directions and the question ledger</XRef>
        </div>
      </Section>

      {/* ——— REGISTER PLATE ——— current work: the 2–3 things happening now
           (active ledger questions) and the flagship plate (P1). */}
      <Section
        meta={sections.find((s) => s.id === "work")!}
        register="plate"
        lede="What is open right now, then the work itself — presented as numbered plates with evidence chains, no card walls."
      >
        <div className="max-w-[62rem]">
          <p className="t-meta t-caps text-ink-2">current — active questions</p>
          <ul className="mt-3">
            {activeQuestions.map((q) => (
              <li key={q.id} className="border-b border-line last:border-b-0">
                <Link
                  to={`/research#${q.id}`}
                  className="group grid min-h-[52px] grid-cols-[auto_1fr] items-baseline gap-x-6 py-3.5 md:grid-cols-[4rem_1fr_auto]"
                >
                  <span className="t-meta text-accent">{q.id.toUpperCase()}</span>
                  <span className="t-small text-ink transition-colors group-hover:text-accent">
                    {q.text}
                  </span>
                  <span className="t-meta text-ink-2 max-md:col-start-2">
                    {q.relatedDemo ? "run: sandbox →" : "ledger →"}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <article className="mt-14 max-w-[54rem]">
          <p className="t-meta t-caps text-ink-2">
            PLATE 01 · {featured[0]?.year}
            {featured[0]?.sample ? (
              <span className="text-ink-2"> · sample entry</span>
            ) : null}
          </p>
          <h3 className="t-h1 mt-3">{featured[0]?.title}</h3>
          <p className="t-lede text-ink-2 mt-4 max-w-[54ch]">{featured[0]?.summary}</p>
          <div className="mt-6 flex flex-wrap gap-2.5">
            {featured[0]?.tags.map((tag) => (
              <button
                key={tag}
                type="button"
                className="u-chip"
                onClick={() => openSearch(tag)}
                aria-label={`Search the site for “${tag}”`}
              >
                {tag} <span aria-hidden="true">⌕</span>
              </button>
            ))}
          </div>
          <p className="t-meta text-ink-2 mt-6">
            {featured[0]?.links.github === null && featured[0]?.links.demo === null
              ? "repo / demo / writeup are intentionally unlisted until they exist — the in-page instrument is live"
              : ""}
          </p>
          <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
            {featured[0]?.demoRef ? (
              <XRef to="/lab/corruption-sandbox">Case study: run the instrument</XRef>
            ) : null}
            <XRef to="/work">All plates</XRef>
          </div>
        </article>
      </Section>

      {/* ——— THE ARCHIVE, AT A GLANCE ——— the concordance introduces itself
           after the person and the work: full § index + honest readings (P1). */}
      <section aria-label="Archive index" className="border-y border-line bg-inset">
        <div className="wrap grid gap-10 py-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <p className="t-kicker text-ink-2">index of one researcher</p>
            <ul className="mt-4">
              {sections.map((s) => (
                <li key={s.id} className="border-b border-line last:border-b-0">
                  <Link
                    to={s.route}
                    className="group flex min-h-[48px] items-baseline gap-3 py-3 transition-colors hover:bg-raised"
                  >
                    <span className="t-meta text-faint" aria-hidden="true">
                      §{s.num}
                    </span>
                    <span className="t-small text-ink transition-colors group-hover:text-accent">
                      {s.title}
                    </span>
                    {s.reading ? (
                      <span className="t-meta text-ink-2 ml-auto hidden text-right sm:inline">
                        {s.reading}
                      </span>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-4 lg:col-start-9">
            <p className="t-kicker text-ink-2">readings</p>
            <p className="t-meta text-ink-2 mt-4 leading-6">{readings}</p>
            <p className="t-small text-ink-2 mt-5 max-w-[44ch]">
              A concordance is a printed retrieval index — the one artifact that is both a book
              and a search system. This site is one too: every reading above is counted from the
              content, nothing is hand-written.{" "}
            </p>
            <div className="mt-4">
              <XRef to="/lab">Open the Lab →</XRef>
            </div>
          </div>
        </div>
      </section>

      {/* ——— REGISTER LEDGER ——— lab preview: one figure, the instruments */}
      <Section
        meta={sections.find((s) => s.id === "lab")!}
        register="ledger"
        lede={`${DEMO_COUNT} offline instruments. Everything computes in your browser; nothing phones home.`}
      >
        <div className="max-w-[52rem]">
          <ContextFillFigure />
          {/* derived from the demo registry — add an instrument and this line
              follows (P1-16) */}
          <p className="t-meta text-ink-2 mt-6">
            instruments —{" "}
            {Object.values(DEMO_REGISTRY)
              .map((d) => `${d.index} ${d.title.toLowerCase()}`)
              .join(" · ")}
          </p>
          <div className="mt-4 flex flex-wrap gap-x-8 gap-y-3">
            <XRef to="/lab/corruption-sandbox">Run the flagship sandbox</XRef>
            <XRef to="/lab">Open the Lab</XRef>
          </div>
        </div>
      </Section>

      {/* ——— REGISTER ESSAY ——— notes preview */}
      <Section
        meta={sections.find((s) => s.id === "notes")!}
        register="essay"
        lede="Notes are written to be read in place — serif, measured, with margin apparatus."
      >
        <div className="u-measure">
          <ul>
            {recentNotes.map((n) => (
              <li key={n.id} className="border-b border-line py-5 last:border-b-0">
                <p className="t-meta text-ink-2">
                  {n.date} · {n.kind}
                </p>
                <h3 className="t-entry mt-2">
                  <Link to={`/notes/${n.id}`} className="u-link">
                    {n.title}
                  </Link>
                </h3>
                <p className="t-small text-ink-2 mt-2">{n.summary}</p>
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <XRef to="/notes">All notes</XRef>
          </div>
        </div>
      </Section>

      {/* ——— REGISTER PLATE ——— connect strip (M5: action-oriented, derived —
           no clickable address exists until links.email does, P0-2) */}
      <Section meta={sections.find((s) => s.id === "connect")!} register="plate">
        <div className="max-w-[54rem]">
          <h3 className="t-h2">
            {site.connectFastest}{" "}
            <span className="t-serif-voice text-ink-2">
              {email ? "email." : "the correspondence page."}
            </span>
          </h3>
          <p className="t-lede text-ink-2 mt-4 max-w-[52ch]">{site.connectIntro}</p>
          <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
            {email ? (
              <a
                href={`mailto:${email}`}
                className="u-link t-small inline-flex min-h-[44px] items-center"
              >
                {email} <span aria-hidden="true">↗</span>
              </a>
            ) : null}
            <XRef to="/connect">All channels</XRef>
          </div>
        </div>
      </Section>
    </>
  );
}
