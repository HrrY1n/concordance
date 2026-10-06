import { useMemo } from "react";
import { Section } from "../components/Section";
import { RankRow } from "../components/RankRow";
import { Dot } from "../components/Dot";
import { chapters } from "../content/chapters";
import { projects } from "../content/projects";
import { cleanCorpus, sandboxQuery } from "../content/lab";
import { bm25Rank } from "../lib/retrieval";
import type { Project } from "../content/types";

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

function StatusMark({ status }: { status: Project["status"] }) {
  if (status === null) return null;
  const tone = status === "active" ? "alive" : status === "maintained" ? "open" : "quiet";
  return (
    <span className="t-mono-sm inline-flex items-center gap-2 uppercase text-ink-3">
      <Dot tone={tone} />
      {status}
    </span>
  );
}

/**
 * FIG. 1 — the frontispiece plate's live figure: the clean-corpus lexical
 * ranking for the Lab query, computed in the visitor's browser with the same
 * BM25 engine as the Lab demo. A figure drawn from data, not decoration.
 */
function PlateFigure() {
  const ranked = useMemo(() => bm25Rank(sandboxQuery, cleanCorpus), []);
  const max = ranked[0]?.score ?? 1;
  return (
    <figure className="mt-10 border-y border-line-1 py-6">
      <figcaption className="t-mono-sm flex flex-wrap justify-between gap-x-6 gap-y-1 text-ink-3">
        <span>FIG. 1 — LEXICAL RANKING, CLEAN CORPUS ({cleanCorpus.length} DOCUMENTS)</span>
        <span>COMPUTED IN YOUR BROWSER · SAME ENGINE AS THE LAB</span>
      </figcaption>
      <ol className="mt-3 divide-y divide-line-1">
        {ranked.map((r, i) => {
          const doc = cleanCorpus.find((d) => d.id === r.id);
          return (
            <li key={r.id}>
              <RankRow
                rank={i + 1}
                max={max}
                doc={{ id: r.id, snippet: doc?.text ?? "", score: r.score }}
              />
            </li>
          );
        })}
      </ol>
      <p className="t-body-sm mt-4 max-w-[68ch] text-ink-3">
        A clean corpus gives a lexical ranker this little certainty — the bottom
        half is near-noise. That is exactly why a single forged passage can take
        the top slot.{" "}
        <a
          href="#lab"
          className="text-ink-2 underline decoration-line-2 underline-offset-4 transition-colors duration-150 hover:text-ink-1"
        >
          Inject it in the Lab ↘
        </a>
      </p>
    </figure>
  );
}

/**
 * §03 — Selected Work as numbered plates of a monograph: full-measure
 * spreads (the one fold-out in the book), display-scale titles, hairline
 * rules, and a live computed figure on Plate 01. No cards, no screenshots.
 */
export function WorkSection() {
  const chapter = chapters.find((c) => c.id === "work")!;
  return (
    <Section chapter={chapter} wide>
      <ol>
        {projects.map((p, i) => (
          <li
            key={p.id}
            id={`plate-${p.id}`}
            className="border-t border-line-1 py-12 first:border-t-0 first:pt-0 lg:py-16"
          >
            <div className="grid grid-cols-1 gap-x-8 gap-y-4 lg:grid-cols-12">
              <div className="flex items-baseline gap-5 lg:col-span-3 lg:flex-col lg:items-start lg:gap-2.5 lg:pt-2">
                <span className="t-mono text-ink-3">PLATE {pad2(i + 1)}</span>
                <StatusMark status={p.status} />
                <span className="t-mono-sm text-ink-4">{p.year}</span>
              </div>
              <div className="lg:col-span-9">
                <h3 className="t-display-2 text-ink-1">{p.title}</h3>
                <p className="t-lede mt-4 max-w-[54ch]">{p.summary}</p>
                <p className="t-mono-sm mt-5 uppercase text-ink-3">
                  {p.kind} · {p.tags.join(" · ")} · {p.role}
                </p>
                {p.note && (
                  <p className="mt-5">
                    {p.noteHref ? (
                      <a
                        href={p.noteHref}
                        className="t-mono-sm uppercase text-accent-ink underline decoration-accent-ink/40 underline-offset-4 transition-colors duration-150 hover:decoration-accent-ink"
                      >
                        {p.note}
                      </a>
                    ) : (
                      <span className="t-mono-sm uppercase text-ink-3">{p.note}</span>
                    )}
                  </p>
                )}
                {p.id === "poison-sandbox" && <PlateFigure />}
              </div>
            </div>
          </li>
        ))}
      </ol>
      <p className="t-mono-sm mt-10 text-ink-4">
        LINKS (REPO / DEMO / WRITEUP) ARE INTENTIONALLY UNLISTED UNTIL THEY EXIST.
      </p>
    </Section>
  );
}
