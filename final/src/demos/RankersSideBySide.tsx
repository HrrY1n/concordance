import { useMemo, useState } from "react";
import { bm25Rank, tfidfRank } from "@/lib/bm25";
import { sandboxCorpus, sandboxHonesty, sandboxQuery } from "@/content/lab";
import { RankList } from "@/components/RankList";

/**
 * 实验仪器 L-03 —— 排序算法双轨对照 (Rankers Side-by-Side)。
 * 相同语料与检索词下对比原生 TF·IDF 与 BM25 的打分差异。
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
    <div className="border border-line-strong bg-inset rounded-sm">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-line px-5 py-4 md:px-7 font-mono text-xs">
        <p className="text-ink-2 break-words">
          检索查询 (Query)：<span className="text-ink font-medium">“{sandboxQuery}”</span>
        </p>
        <p className="text-ink-2">
          当前语料规模 {corpus.length} 篇 · TF·IDF 对照 BM25 · 纯本地即时运算
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 border-b border-line px-5 py-4 md:px-7">
        <button type="button" aria-pressed={injected} onClick={() => setInjected((v) => !v)} className="u-btn">
          {injected ? "移除投毒文档 (Remove poisoned document)" : "注入对抗性投毒文档 (Inject poisoned document d8)"}
        </button>
        <p className="t-meta text-ink-2 font-mono text-xs" aria-live="polite">
          {disagree
            ? `算法分歧：BM25 首位为 ${top1.bm}，而 TF·IDF 首位为 ${top1.tf}`
            : `两套算法首位取得一致：${top1.bm} (both rankers agree on top-1: ${top1.bm})`}
        </p>
      </div>

      <div className="grid gap-10 px-5 py-6 md:px-7 lg:grid-cols-2">
        <div>
          <h3 className="t-kicker text-ink-2 font-mono">BM25 算法 (k1 1.5 · b 0.75) —— Top 5 实时排序</h3>
          <p className="t-meta text-faint font-mono text-xs mt-1" aria-hidden="true">
            ▲ 相较于 TF·IDF 排名更靠前的文档
          </p>
          <div className="mt-4">
            <RankList ranked={bm} top={5} ariaLabel="BM25 算法 Top 5 排序" deltas={bmDeltaVsTf} />
          </div>
        </div>
        <div>
          <h3 className="t-kicker text-ink-2 font-mono">TF·IDF 算法 (未做文档长度归一化) —— Top 5</h3>
          <p className="t-meta text-faint font-mono text-xs mt-1" aria-hidden="true">
            ▲ 相较于 BM25 排名更靠前的文档
          </p>
          <div className="mt-4">
            <RankList ranked={tf} top={5} ariaLabel="TF·IDF 算法 Top 5 排序" deltas={tfDeltaVsBm} />
          </div>
        </div>
      </div>

      <div className="border-t border-line px-5 py-4 md:px-7 text-xs md:text-sm text-ink-2 leading-relaxed">
        <p className="max-w-[66ch]">
          两套算法计算完全相同的词频与稀缺度权重。BM25 的核心区别在于引入了文档长度惩罚归一化（Length Normalization）
          与词频饱和度控制 —— 仅仅是这一项数学差异，就足以直接颠覆首位文档的排名归属。
          在 RAG 架构中，排序机制本身就是由一系列具体的工程决策构成的，绝非天然客观的中立法则。
        </p>
        <p className="t-meta text-accent font-mono text-xs mt-4">{sandboxHonesty}</p>
      </div>
    </div>
  );
}
