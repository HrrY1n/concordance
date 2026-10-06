import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { bm25Rank, rankDeltas, type ScoredDoc } from "@/lib/bm25";
import { useFlipList } from "@/lib/flip";
import { sandboxCorpus, sandboxHonesty, sandboxQuery, toyDefense } from "@/content/lab";
import { RankList } from "@/components/RankList";

/**
 * FLAGSHIP — Corruption Sandbox (CONTENT_PACK §demo, acceptance-tested).
 * The full §4 / A1 + D2 kit: the toy defense re-scores, the list re-sorts,
 * THEN the top-5 is taken; ▲▼ deltas are computed data; the aria-live region
 * speaks each scenario in words; the bar floor is 0.02 with overflow clamped;
 * and the honesty declaration never leaves the module.
 */
export function CorruptionSandbox({ detailed = false }: { detailed?: boolean }) {
  const [injected, setInjected] = useState(false);
  const [defense, setDefense] = useState(false);

  const corpus = useMemo(
    () => (injected ? sandboxCorpus : sandboxCorpus.filter((d) => !d.poisoned)),
    [injected],
  );

  const ranked: ScoredDoc[] = useMemo(
    () =>
      bm25Rank(
        corpus,
        sandboxQuery,
        defense ? { defense: { patterns: toyDefense.patterns, factor: toyDefense.factor } } : {},
      ),
    [corpus, defense],
  );

  const topId = ranked[0]?.id ?? "—";
  const d8 = ranked.find((r) => r.id === "d8");
  const d8Rank = d8 ? ranked.indexOf(d8) + 1 : undefined;

  // ▲▼ deltas vs the previous toggle state — data, derived during render from
  // the memoized ranking's identity (no cascading effects).
  const [deltaState, setDeltaState] = useState(() => ({
    prev: [] as ScoredDoc[],
    deltas: new Map<string, number>(),
  }));
  if (deltaState.prev !== ranked) {
    setDeltaState({
      prev: ranked,
      deltas: deltaState.prev.length > 0 ? rankDeltas(deltaState.prev, ranked) : new Map(),
    });
  }
  const deltas = deltaState.deltas;

  const listRef = useRef<HTMLOListElement>(null);
  useFlipList(listRef);

  // aria-live: one message per scenario, in words (color/position alone carry
  // nothing for a screen reader). Derived from the control key during render.
  const configKey = `${injected ? "1" : "0"}${defense ? "1" : "0"}`;
  const [announcementState, setAnnouncementState] = useState(() => ({
    key: configKey,
    text: "",
  }));
  if (announcementState.key !== configKey) {
    const text = !injected
      ? "Poisoned document removed. Clean corpus restored."
      : defense && d8Rank !== undefined
        ? `Toy defense on: the poisoned document is demoted to rank ${d8Rank}. Top result is ${topId}.`
        : `Poisoned document injected: it ranks ${d8Rank ?? "?"} with score ${d8?.score.toFixed(2) ?? "—"}.`;
    setAnnouncementState({ key: configKey, text });
  }

  const btn = "u-btn";
  return (
    <div className="border border-line-strong bg-inset">
      {/* readout header — every number computed, nothing decorative */}
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-line px-5 py-4 md:px-7">
        <p className="t-meta text-ink-2 break-words">
          query <span className="text-ink">“{sandboxQuery}”</span>
        </p>
        <p className="t-meta t-caps text-ink-2">
          corpus {corpus.length} docs · method bm25 (k1 1.5 · b 0.75) · 0ms network
        </p>
      </div>

      {/* controls */}
      <div className="flex flex-wrap items-center gap-3 border-b border-line px-5 py-4 md:px-7">
        <button
          type="button"
          aria-pressed={injected}
          onClick={() => setInjected((v) => !v)}
          className={btn}
        >
          {injected ? "Remove the poisoned document" : "Inject poisoned document (d8)"}
        </button>
        <button
          type="button"
          aria-pressed={defense}
          onClick={() => setDefense((v) => !v)}
          className={btn}
        >
          {defense ? "Disable toy defense" : "Enable toy defense"}
        </button>
        {defense ? (
          <p className="t-meta t-caps text-ink-2 break-all">{toyDefense.label}</p>
        ) : (
          <p className="t-meta t-caps text-ink-2 break-all">toy heuristic, not a real defense</p>
        )}
      </div>

      <div className="grid gap-10 px-5 py-6 md:px-7 lg:grid-cols-2">
        {/* corpus */}
        <div>
          <h3 className="t-kicker text-ink-2">corpus — {corpus.length} documents</h3>
          <ul className="mt-4 space-y-3">
            {corpus.map((doc) => {
              const poisoned = Boolean(doc.poisoned);
              return (
                <li
                  key={doc.id}
                  className={`pl-3 ${poisoned ? "border-l-2 border-l-signal" : "border-l border-line"}`}
                >
                  <p className="t-meta flex flex-wrap items-baseline gap-x-3">
                    <span className={poisoned ? "text-signal" : "text-ink-2"}>{doc.id}</span>
                    {poisoned ? (
                      <span className="t-caps text-signal" data-flag="poisoned">
                        ▲ poisoned
                      </span>
                    ) : null}
                  </p>
                  <p className="t-small text-ink-2 mt-1">{doc.text}</p>
                </li>
              );
            })}
          </ul>
        </div>

        {/* ranking */}
        <div>
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
            <h3 className="t-kicker text-ink-2">ranking — top 5, scored live</h3>
            <p className="t-meta text-faint" aria-hidden="true">
              ▲ climbed · ▼ fell since last toggle
            </p>
          </div>
          <div className="mt-4">
            <RankList
              ranked={ranked}
              top={5}
              showText
              ariaLabel="BM25 ranking, top five of the current corpus"
              flipRef={listRef}
              deltas={deltas}
            />
          </div>
          <p className="t-small text-ink-2 mt-5 max-w-[52ch]">
            One passage at the top of this list is treated as evidence — regardless of how it got
            there. That is the whole attack.
          </p>
        </div>
      </div>

      <p aria-live="polite" className="sr-only">
        {announcementState.text}
      </p>

      {/* honesty line — permanent, not a footnote */}
      <div className="border-t border-line px-5 py-4 md:px-7">
        <p className="t-meta t-caps text-ink-2">{sandboxHonesty}</p>
        {detailed ? (
          <div className="essay mt-5 max-w-[66ch]">
            <p className="t-small text-ink-2">
              BM25 counts query-term matches, weighted by rarity and document length. The poisoned
              passage was written to repeat the vocabulary of this query — “external documents
              change a model’s answers” — so it outranks passages that genuinely answer the
              question. Nothing was hacked: the ranking did exactly what lexical scoring does.
            </p>
            <p className="t-small text-ink-2 mt-3">
              The toy defense searches for instruction-injection patterns and multiplies what it
              finds by 0.1, then re-sorts. It works here because the poison is crude; it fails
              quietly the moment a poisoned passage drops the imperative voice — which is precisely
              why the question exists (
              <Link to="/research#q1" className="u-link">
                Q1
              </Link>{" "}
              ·{" "}
              <Link to="/research#q2" className="u-link">
                Q2
              </Link>{" "}
              in the ledger).
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
