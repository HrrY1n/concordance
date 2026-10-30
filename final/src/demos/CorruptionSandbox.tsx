import { useMemo, useRef, useState } from "react";
import { bm25Rank, rankDeltas, type ScoredDoc } from "@/lib/bm25";
import { useFlipList } from "@/lib/flip";
import { sandboxCorpus, sandboxHonesty, sandboxQuery, toyDefense } from "@/content/lab";
import { RankList } from "@/components/RankList";

/**
 * 旗舰实验仪器 —— 知识投毒模拟沙盒 (Corruption Sandbox)。
 * 纯本地计算，支持动态注入恶意对抗段落与开启启发式过滤策略。
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

  const configKey = `${injected ? "1" : "0"}${defense ? "1" : "0"}`;
  const [announcementState, setAnnouncementState] = useState(() => ({
    key: configKey,
    text: "",
  }));
  if (announcementState.key !== configKey) {
    const text = !injected
      ? "已移除投毒文档，恢复干净语料库排序。"
      : defense && d8Rank !== undefined
        ? `启发式防御已开启：恶意投毒文档降权至第 ${d8Rank} 位，当前首位推荐为 ${topId}。`
        : `已注入对抗性投毒文档：该文档当前跃升至第 ${d8Rank ?? "?"} 位，BM25 得分为 ${d8?.score.toFixed(2) ?? "—"}。`;
    setAnnouncementState({ key: configKey, text });
  }

  const btn = "u-btn";
  return (
    <div className="border border-line-strong bg-inset rounded-sm">
      {/* 状态看板顶栏 */}
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-line px-5 py-4 md:px-7 font-mono text-xs">
        <p className="text-ink-2 break-words">
          检索查询 (Query)：<span className="text-ink font-medium">“{sandboxQuery}”</span>
        </p>
        <p className="text-ink-2">
          当前语料规模 {corpus.length} 篇 · 算法 BM25 (k1 1.5 · b 0.75) · 纯浏览器计算
        </p>
      </div>

      {/* 交互操作栏 */}
      <div className="flex flex-wrap items-center gap-3 border-b border-line px-5 py-4 md:px-7">
        <button
          type="button"
          aria-pressed={injected}
          onClick={() => setInjected((v) => !v)}
          className={btn}
        >
          {injected ? "移除投毒文档 (Remove poisoned document)" : "注入对抗性投毒文档 (Inject poisoned document d8)"}
        </button>
        <button
          type="button"
          aria-pressed={defense}
          onClick={() => setDefense((v) => !v)}
          className={btn}
        >
          {defense ? "关闭启发式过滤 (Disable toy defense)" : "开启启发式过滤 (Enable toy defense)"}
        </button>
        {defense ? (
          <p className="t-meta text-accent break-all text-xs font-mono">{toyDefense.label}</p>
        ) : (
          <p className="t-meta text-ink-2 break-all text-xs font-mono">启发式教学策略，非全能商业级防御</p>
        )}
      </div>

      <div className="grid gap-10 px-5 py-6 md:px-7 lg:grid-cols-2">
        {/* 语料库列表 */}
        <div>
          <h3 className="t-kicker text-ink-2 font-mono">语料库文档明细 —— 共 {corpus.length} 篇</h3>
          <ul className="mt-4 space-y-3">
            {corpus.map((doc) => {
              const poisoned = Boolean(doc.poisoned);
              return (
                <li
                  key={doc.id}
                  className={`pl-3 ${poisoned ? "border-l-2 border-l-signal bg-signal/5 py-1 rounded-r" : "border-l border-line"}`}
                >
                  <p className="t-meta flex flex-wrap items-baseline gap-x-3 font-mono text-xs">
                    <span className={poisoned ? "text-signal font-medium" : "text-ink-2"}>{doc.id}</span>
                    {poisoned ? (
                      <span className="text-signal font-medium" data-flag="poisoned">
                        ▲ 对抗性投毒段落
                      </span>
                    ) : null}
                  </p>
                  <p className="t-small text-ink-2 mt-1 leading-relaxed text-xs md:text-sm">{doc.text}</p>
                </li>
              );
            })}
          </ul>
        </div>

        {/* 实时排位 */}
        <div>
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
            <h3 className="t-kicker text-ink-2 font-mono">即时计算排序 —— Top 5 实时打分</h3>
            <p className="t-meta text-faint font-mono text-xs" aria-hidden="true">
              ▲ 位次上升 · ▼ 位次下降
            </p>
          </div>
          <div className="mt-4">
            <RankList
              ranked={ranked}
              top={5}
              showText
              ariaLabel="BM25 算法实时运算排序，展示当前语料前 5 名"
              flipRef={listRef}
              deltas={deltas}
            />
          </div>
          <p className="t-small text-ink-2 mt-5 max-w-[52ch] leading-relaxed text-xs md:text-sm">
            排列在顶部的段落将直接被下游大语言模型当作事实证据引用 —— 无论其是通过何种手段混入该位置。
            这正是知识库投毒攻击的本质隐患。
          </p>
        </div>
      </div>

      <p aria-live="polite" className="sr-only">
        {announcementState.text}
      </p>

      {/* 底部真实性与技术原理说明 */}
      <div className="border-t border-line px-5 py-4 md:px-7">
        <p className="t-meta text-accent font-mono text-xs">{sandboxHonesty}</p>
        {detailed ? (
          <div className="essay mt-5 max-w-[68ch] space-y-3 text-xs md:text-sm text-ink-2 leading-relaxed">
            <p>
              BM25 算法通过统计检索词在文档中的出现频次，并结合文档长度归一化与词元稀缺度加权打分。
              投毒段落针对查询语句精准堆砌了 “external documents change a model's answers” 等核心词汇，
              从而轻而易举地压倒了真正解答该问题的客观文档。这不是黑客漏洞，词法相关度打分天然就是如此运作的。
            </p>
            <p>
              演示中的启发式过滤规则通过扫描特征提示词（如 “ignore previous instructions”），将命中段落得分乘以 0.1 后重新排序。
              它在此处生效是因为注入文本非常简陋；一旦攻击者改换温和陈述句式，规则防线便悄然失效 —— 这正是研究台账为何保持关注的核心所在。
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
