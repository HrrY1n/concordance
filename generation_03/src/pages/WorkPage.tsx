import { useMemo } from "react";
import { Link } from "react-router-dom";
import { bm25Rank } from "@/lib/bm25";
import { sandboxCorpus, sandboxQuery, toyDefense } from "@/content/lab";
import { chains, projects } from "@/content/projects";
import { DEMO_REGISTRY } from "@/content/ids";
import { useDocumentMeta } from "@/lib/seo";
import { useSearch } from "@/lib/palette";
import { Figure, PageShell, XRef } from "@/components/structure";
import { sectionByRoute } from "@/lib/sections";

/**
 * §02 WORK — Selected Work as numbered plates of a concordance: full-measure
 * spreads, display-scale titles, hairline rules, and an evidence chain under
 * each title (problem → method → artifacts that exist). No cards, ever.
 */

function StatusMark({ status }: { status: "active" | "maintained" | "archived" | null }) {
  if (status === null) return null;
  const tone = status === "active" ? "alive" : status === "maintained" ? "alive" : "quiet";
  return (
    <span className="t-meta t-caps inline-flex items-center gap-2 text-ink-2">
      <span className="dot" data-tone={tone} aria-hidden="true" />
      {status}
    </span>
  );
}

/** FIG.W1 — the poison's score under two regimes, computed live. */
function PoisonScoreFigure() {
  const scores = useMemo(() => {
    const rawRanking = bm25Rank(sandboxCorpus, sandboxQuery);
    const defendedRanking = bm25Rank(sandboxCorpus, sandboxQuery, {
      defense: { patterns: toyDefense.patterns, factor: toyDefense.factor },
    });
    const raw = rawRanking.find((r) => r.id === "d8")!;
    const def = defendedRanking.find((r) => r.id === "d8")!;
    const rawRank = rawRanking.findIndex((r) => r.id === "d8") + 1;
    const defRank = defendedRanking.findIndex((r) => r.id === "d8") + 1;
    return {
      raw: { score: raw.score, rank: rawRank },
      defended: { score: def.score, rank: defRank },
    };
  }, []);
  const max = Math.max(scores.raw.score, scores.defended.score);
  const bar = (s: number) => Math.min(1, Math.max(s / max, 0.02));
  return (
    <Figure
      id="FIG. W1"
      title="The poison's score, d8, under two regimes"
      method="bm25 on the full 8-doc corpus · computed in your browser · 0ms network"
    >
      <dl className="max-w-[560px] space-y-3">
        <div className="flex items-baseline gap-3">
          <dt className="t-meta t-caps text-ink-2 w-28 shrink-0">undefended</dt>
          <dd className="flex flex-1 items-baseline gap-3">
            <span className="rank-track" aria-hidden="true">
              <span className="rank-fill" data-poisoned="true" style={{ transform: `scaleX(${bar(scores.raw.score)})` }} />
            </span>
            <span className="t-meta text-ink-2 tabular-nums">
              {scores.raw.score.toFixed(2)} · rank {scores.raw.rank}
            </span>
          </dd>
        </div>
        <div className="flex items-baseline gap-3">
          <dt className="t-meta t-caps text-ink-2 w-28 shrink-0">toy defense ×0.1</dt>
          <dd className="flex flex-1 items-baseline gap-3">
            <span className="rank-track" aria-hidden="true">
              <span className="rank-fill" style={{ transform: `scaleX(${bar(scores.defended.score)})` }} />
            </span>
            <span className="t-meta text-ink-2 tabular-nums">
              {scores.defended.score.toFixed(2)} · rank {scores.defended.rank}
            </span>
          </dd>
        </div>
      </dl>
      <p className="t-small text-ink-2 mt-4 max-w-[60ch]">
        The defense multiplies matching scores by 0.1 and re-sorts — d8 drops from the top slot to
        the bottom of the ranking. A heuristic this crude is a demonstration, not a defense; the
        interesting question is which quiet failures remain.{" "}
        <Link to="/research#q2" className="u-link">
          Q2 in the ledger →
        </Link>
      </p>
    </Figure>
  );
}

export default function WorkPage() {
  useDocumentMeta(
    "Selected Work",
    "Plates with evidence chains: retrieval instrumentation, robustness tooling, and the archive itself — links listed only where they exist.",
  );
  const { openSearch } = useSearch();
  const meta = sectionByRoute("/work")!;

  return (
    <PageShell
      meta={meta}
      register="plate"
      lede="Each plate carries its evidence chain: the problem as a question, the method as steps, and only artifacts that exist. External links stay unlisted until they do."
    >
      <ol>
        {projects.map((p, i) => {
          const chain = chains[p.id];
          return (
            <li
              key={p.id}
              id={`plate-${p.id}`}
              className="scroll-mt-24 border-t border-line py-14 first:border-t-0 first:pt-0 lg:py-16"
            >
              <div className="grid grid-cols-1 gap-x-10 gap-y-5 lg:grid-cols-12">
                {/* plate meta column */}
                <div className="flex items-baseline gap-5 lg:col-span-3 lg:flex-col lg:items-start lg:gap-2.5 lg:pt-2">
                  <span className="t-meta t-caps text-ink-2">
                    PLATE {String(i + 1).padStart(2, "0")}
                  </span>
                  <StatusMark status={p.status} />
                  <span className="t-meta text-ink-2">{p.year}</span>
                </div>

                {/* plate body */}
                <div className="lg:col-span-9">
                  <h2 className="t-h1">{p.title}</h2>
                  <p className="t-lede text-ink-2 mt-4 max-w-[54ch]">{p.summary}</p>

                  <dl className="t-meta mt-6 grid max-w-[62ch] gap-x-8 gap-y-2 sm:grid-cols-[7rem_1fr]">
                    <dt className="t-caps text-ink-2">role</dt>
                    <dd className="text-ink-2">{p.role}</dd>
                    <dt className="t-caps text-ink-2">stack</dt>
                    <dd className="flex flex-wrap gap-x-2 gap-y-1">
                      {p.tags.map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => openSearch(tag)}
                          className="text-ink-2 underline decoration-line-strong underline-offset-3 transition-colors hover:text-accent hover:decoration-accent"
                          aria-label={`Search the site for “${tag}”`}
                        >
                          {tag}
                        </button>
                      ))}
                    </dd>
                    <dt className="t-caps text-ink-2">links</dt>
                    <dd className="text-ink-2">
                      {p.links.github || p.links.demo || p.links.writeup ? (
                        <span className="flex flex-wrap gap-x-4">
                          {p.links.github ? <a className="u-link" href={p.links.github}>repo ↗</a> : null}
                          {p.links.demo ? <a className="u-link" href={p.links.demo}>demo ↗</a> : null}
                          {p.links.writeup ? <a className="u-link" href={p.links.writeup}>writeup ↗</a> : null}
                        </span>
                      ) : (
                        <span>unlisted until they exist</span>
                      )}
                    </dd>
                    <dt className="t-caps text-ink-2">case study</dt>
                    <dd>
                      {p.demoRef ? (
                        <XRef to={DEMO_REGISTRY[p.demoRef].route}>
                          {DEMO_REGISTRY[p.demoRef].title} — live in §03
                        </XRef>
                      ) : p.id === "this-site" ? (
                        <XRef to="/">you are standing in it</XRef>
                      ) : (
                        <span className="text-ink-2">none yet</span>
                      )}
                    </dd>
                  </dl>

                  {/* evidence chain */}
                  <div className="mt-8 border-l-2 border-line pl-5">
                    <p className="t-meta t-caps text-ink-2">evidence chain</p>
                    <p className="t-small text-ink mt-2 max-w-[56ch]">{chain.problem}</p>
                    <ul className="t-code text-ink-2 mt-3 space-y-1">
                      {chain.method.map((m) => (
                        <li key={m}>· {m}</li>
                      ))}
                    </ul>
                    <ul className="t-meta text-ink-2 mt-3 space-y-1">
                      {chain.artifacts.map((a) => (
                        <li key={a}>— {a}</li>
                      ))}
                    </ul>
                  </div>

                  {p.id === "poison-sandbox" ? (
                    <div className="mt-10">
                      <PoisonScoreFigure />
                    </div>
                  ) : null}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </PageShell>
  );
}
