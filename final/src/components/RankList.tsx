import { forwardRef } from "react";
import type { ScoredDoc } from "@/lib/bm25";

/**
 * The shared rank row — every bar on this site is real arithmetic rendered
 * the same way. Bar growth is scaleX (transform-only); the 0.02 floor keeps
 * zero-score rows visible and the clamp keeps overflow inside the track
 * (§4 / A1, D2). The poisoned row is never color-only: ▲ POISONED label +
 * signal bar + left border, and the live region says it in words.
 */
export const RANK_FLOOR = 0.02;

export interface RankRowData extends ScoredDoc {
  label?: string;
  delta?: number;
  rank: number;
}

export const RankRow = forwardRef<HTMLLIElement, { row: RankRowData; max: number; showText?: boolean }>(
  function RankRow({ row, max, showText = false }, ref) {
    const width = Math.min(1, Math.max(max > 0 ? row.score / max : 0, RANK_FLOOR));
    return (
      <li
        ref={ref}
        data-flip-key={row.id}
        className={`flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-line py-2.5 last:border-b-0 ${
          row.poisoned ? "border-l-2 border-l-signal pl-3" : "pl-3"
        }`}
      >
        <span className="t-meta text-faint w-6 shrink-0 text-right" aria-hidden="true">
          {row.rank}
        </span>
        <span className={`t-meta shrink-0 ${row.poisoned ? "text-signal" : "text-ink-2"}`}>
          {row.id}
        </span>
        {row.poisoned ? (
          <span className="t-meta t-caps text-signal shrink-0" data-flag="poisoned">
            ▲ poisoned
          </span>
        ) : null}
        {showText && row.label ? (
          <span className="t-small text-ink-2 order-last w-full min-w-0 basis-full sm:order-none sm:w-auto sm:basis-auto sm:max-w-[36ch] truncate">
            {row.label}
          </span>
        ) : null}
        {typeof row.delta === "number" && row.delta !== 0 ? (
          <span
            className={`t-meta shrink-0 ${row.delta > 0 ? "text-ok" : "text-signal"}`}
            aria-hidden="true"
          >
            {row.delta > 0 ? `▲${row.delta}` : `▼${-row.delta}`}
          </span>
        ) : null}
        <span
          className="rank-track self-center"
          role="presentation"
          aria-hidden="true"
          data-poisoned={row.poisoned ? "true" : undefined}
        >
          <span
            className="rank-fill"
            data-poisoned={row.poisoned ? "true" : undefined}
            style={{ transform: `scaleX(${width})` }}
          />
        </span>
        <span className="t-meta text-ink-2 w-14 shrink-0 text-right tabular-nums">
          {row.score.toFixed(2)}
        </span>
      </li>
    );
  },
);

/**
 * RankList — top-N rows over a scored corpus. `flipRef` wires the FLIP hook
 * when the caller wants reorder animation; without it rows simply re-sort.
 */
export function RankList({
  ranked,
  top = 5,
  showText = false,
  ariaLabel,
  flipRef,
  deltas,
}: {
  ranked: ScoredDoc[];
  top?: number;
  showText?: boolean;
  ariaLabel: string;
  flipRef?: React.RefObject<HTMLOListElement | null>;
  deltas?: Map<string, number>;
}) {
  const shown = ranked.slice(0, top);
  const max = shown[0]?.score ?? 1;
  return (
    <ol ref={flipRef} aria-label={ariaLabel}>
      {shown.map((entry, i) => (
        <RankRow
          key={entry.id}
          row={{ ...entry, rank: i + 1, delta: deltas?.get(entry.id) }}
          max={max}
          showText={showText}
        />
      ))}
    </ol>
  );
}
