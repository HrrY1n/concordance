import { useMemo, useState } from "react";
import { bm25Rank, tfidfRank } from "@/lib/bm25";
import { sandboxCorpus, sandboxHonesty, sandboxQuery } from "@/content/lab";
import { RankList } from "@/components/RankList";

/**
 * L-03 — Rankers, Side by Side. Same corpus, same query, two lexical rankers:
 * raw TF·IDF and BM25. The only mechanical difference is length normalization
 * (plus saturation), and it visibly changes the top slot. Deltas shown on
 * each list are relative to the OTHER ranker — a real comparison, computed.
 */
export function RankersSideBySide() {
  const [injected, setInjected] = useState(false);

  const corpus = useMemo(
    () => (injected ? sandboxCorpus : sandboxCorpus.filter((d) => !d.poisoned)),
    [injected],
  );

  const { bm, tf, bmDeltaVsTf, tfDeltaVsBm, top1 } = useMemo(() => {
    const bm = bm25Rank(corpus, sandboxQuery);
    const tf = tfidfRank(corpus, sandboxQuery);
    const bmPos = new Map(bm.map((d, i) => [d.id, i + 1]));
    const tfPos = new Map(tf.map((d, i) => [d.id, i + 1]));
    const bmDeltaVsTf = new Map(
      bm.map((d) => [d.id, (tfPos.get(d.id) ?? 0) - (bmPos.get(d.id) ?? 0)]),
    );
    const tfDeltaVsBm = new Map(
      tf.map((d) => [d.id, (bmPos.get(d.id) ?? 0) - (tfPos.get(d.id) ?? 0)]),
    );
    return { bm, tf, bmDeltaVsTf, tfDeltaVsBm, top1: { bm: bm[0]?.id, tf: tf[0]?.id } };
  }, [corpus]);

  const disagree = top1.bm !== top1.tf;

  return (
    <div className="border border-line-strong bg-inset">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-line px-5 py-4 md:px-7">
        <p className="t-meta text-ink-2 break-words">
          query <span className="text-ink">“{sandboxQuery}”</span>
        </p>
        <p className="t-meta t-caps text-ink-2">
          corpus {corpus.length} docs · tf·idf vs bm25 · 0ms network
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 border-b border-line px-5 py-4 md:px-7">
        <button type="button" aria-pressed={injected} onClick={() => setInjected((v) => !v)} className="u-btn">
          {injected ? "Remove the poisoned document" : "Inject poisoned document (d8)"}
        </button>
        <p className="t-meta t-caps text-ink-2" aria-live="polite">
          {disagree
            ? `top-1 disagrees: bm25 says ${top1.bm} · tf·idf says ${top1.tf}`
            : `both rankers agree on top-1: ${top1.bm}`}
        </p>
      </div>

      <div className="grid gap-10 px-5 py-6 md:px-7 lg:grid-cols-2">
        <div>
          <h3 className="t-kicker text-ink-2">bm25 (k1 1.5 · b 0.75) — top 5</h3>
          <p className="t-meta text-faint mt-1" aria-hidden="true">
            ▲ does better here than under tf·idf
          </p>
          <div className="mt-4">
            <RankList ranked={bm} top={5} ariaLabel="BM25 ranking, top five" deltas={bmDeltaVsTf} />
          </div>
        </div>
        <div>
          <h3 className="t-kicker text-ink-2">tf·idf (raw, no length norm) — top 5</h3>
          <p className="t-meta text-faint mt-1" aria-hidden="true">
            ▲ does better here than under bm25
          </p>
          <div className="mt-4">
            <RankList ranked={tf} top={5} ariaLabel="TF·IDF ranking, top five" deltas={tfDeltaVsBm} />
          </div>
        </div>
      </div>

      <div className="border-t border-line px-5 py-4 md:px-7">
        <p className="t-small text-ink-2 max-w-[66ch]">
          Both rankers count the same terms with the same rarity weights. BM25 additionally
          normalizes by document length and saturates term frequency — that is the entire
          difference, and it is already enough to move the top slot. Ranking is a series of
          small policy decisions, not a law of nature.
        </p>
        <p className="t-meta t-caps text-ink-2 mt-4">{sandboxHonesty}</p>
      </div>
    </div>
  );
}
