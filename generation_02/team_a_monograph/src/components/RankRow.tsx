import { formatScore } from "../lib/retrieval";

export interface RankRowData {
  id: string;
  snippet: string;
  score: number;
  poisoned?: boolean;
  /** 1 = untouched; < 1 = demoted by the toy defense (shown honestly). */
  defenseFactor?: number;
  defensePatterns?: string[];
}

interface RankRowProps {
  rank: number;
  max: number;
  doc: RankRowData;
}

/**
 * One ranked document: rank · id · snippet · score bar. Rendered as a plain
 * grid div so callers own the list semantics (li / motion.li).
 * The score bar is a hairline-weight track with a thin ink fill; a poisoned
 * document turns the accent (orange = the living attack, the site's only hue).
 * Everything is real text — the row needs no ARIA label.
 */
export function RankRow({ rank, max, doc }: RankRowProps) {
  const ratio = max > 0 ? Math.max(doc.score / max, 0) : 0;
  const demoted = (doc.defenseFactor ?? 1) < 1;
  return (
    <div className="grid grid-cols-[2.25rem_1fr_3.5rem] items-baseline gap-x-3 gap-y-1 py-2.5 sm:grid-cols-[2.5rem_1fr_4rem]">
      <span aria-hidden="true" className="t-mono-sm text-ink-4">
        {String(rank).padStart(2, "0")}
      </span>
      <div className="min-w-0">
        <p className="t-mono-sm">
          <span className={doc.poisoned ? "text-accent-ink" : "text-ink-1"}>{doc.id}</span>
          {doc.poisoned && <span className="text-accent-ink"> · POISONED</span>}
          {demoted && (
            <span className="text-ink-4">
              {" "}
              · ×{doc.defenseFactor} {(doc.defensePatterns ?? []).join(" + ").toUpperCase()}
            </span>
          )}
        </p>
        <p className="t-body-sm mt-0.5 truncate text-ink-3">{doc.snippet}</p>
        <div aria-hidden="true" className="mt-1.5 h-[3px] w-full bg-line-1">
          <div
            className="h-full origin-left transition-transform duration-200 ease-out"
            style={{
              transform: `scaleX(${ratio})`,
              backgroundColor: doc.poisoned
                ? "var(--color-accent)"
                : "var(--color-ink-2)",
            }}
          />
        </div>
      </div>
      <span aria-hidden="true" className="t-mono-sm text-right text-ink-2">
        {formatScore(doc.score)}
      </span>
    </div>
  );
}
