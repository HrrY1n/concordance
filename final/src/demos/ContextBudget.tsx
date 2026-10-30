import { useState } from "react";
import {
  budgetChunks,
  budgetDefault,
  budgetMax,
  budgetMin,
  budgetQuestion,
  budgetStep,
} from "@/content/lab";
import { RANK_FLOOR } from "@/components/RankList";

/**
 * 实验仪器 L-02 —— 上下文预算动态折算器 (Context Budget)。
 * 严密的 Token 预算下展示切分与排序对大模型可用证据空间的强制截断。
 */
export function ContextBudget() {
  const [budget, setBudget] = useState(budgetDefault);
  const [order, setOrder] = useState<string[]>(budgetChunks.map((c) => c.id));

  const chunks = order
    .map((id) => budgetChunks.find((c) => c.id === id))
    .filter((c): c is (typeof budgetChunks)[number] => Boolean(c));

  const states = chunks.reduce<{ chunk: (typeof chunks)[number]; tokens: number; fits: boolean; used: number }[]>(
    (acc, chunk) => {
      const tokens = Math.ceil(chunk.text.length / 4);
      const usedBefore = acc.length > 0 ? acc[acc.length - 1].used : 0;
      const used = usedBefore + tokens <= budget ? usedBefore + tokens : usedBefore;
      acc.push({ chunk, tokens, fits: usedBefore + tokens <= budget, used });
      return acc;
    },
    [],
  );
  const used = states.length > 0 ? states[states.length - 1].used : 0;
  const truncated = states.filter((s) => !s.fits).length;
  const maxTokens = Math.max(...states.map((s) => s.tokens));

  const move = (id: string, delta: -1 | 1) => {
    setOrder((prev) => {
      const idx = prev.indexOf(id);
      const next = idx + delta;
      if (idx < 0 || next < 0 || next >= prev.length) return prev;
      const copy = [...prev];
      [copy[idx], copy[next]] = [copy[next], copy[idx]];
      return copy;
    });
  };

  return (
    <div className="border border-line-strong bg-inset rounded-sm">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-line px-5 py-4 md:px-7 font-mono text-xs">
        <p className="text-ink-2 break-words">
          核心问题：<span className="text-ink font-medium">“{budgetQuestion}”</span>
        </p>
        <p className="text-ink-2">折算规则：字符数 ÷ 4 (估算) · 纯本地即时运算</p>
      </div>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-line px-5 py-4 md:px-7">
        <label htmlFor="budget-slider" className="t-small text-ink-2 font-mono text-xs md:text-sm">
          Token 预算上限 (Token budget)
        </label>
        <input
          id="budget-slider"
          type="range"
          min={budgetMin}
          max={budgetMax}
          step={budgetStep}
          value={budget}
          onChange={(event) => setBudget(Number(event.target.value))}
          className="min-h-[44px] min-w-[180px] flex-1"
          style={{ accentColor: "var(--accent)" }}
        />
        <output htmlFor="budget-slider" className="t-meta text-ink font-mono font-medium">
          {budget} tok
        </output>
      </div>

      <ul className="px-5 py-5 md:px-7">
        {states.map(({ chunk, tokens, fits }, i) => (
          <li key={chunk.id} className="border-b border-line py-4 last:border-b-0">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="t-meta text-ink-2 font-mono text-xs">{chunk.id}</span>
              <span className="t-meta text-ink-2 font-mono text-xs">约 {tokens} Token</span>
              {fits ? (
                <span className="t-meta t-caps text-ok font-mono text-xs">▲ 完整容纳 (fits)</span>
              ) : (
                <span className="t-meta t-caps text-signal font-mono text-xs" data-flag="truncated">
                  ▼ 硬性截断 (truncated)
                </span>
              )}
              <span className="ml-auto flex items-center gap-1">
                <button
                  type="button"
                  aria-label={`将 ${chunk.id} 上移`}
                  disabled={i === 0}
                  onClick={() => move(chunk.id, -1)}
                  className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded border border-line bg-raised text-ink-2 transition-colors hover:text-ink disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  type="button"
                  aria-label={`将 ${chunk.id} 下移`}
                  disabled={i === states.length - 1}
                  onClick={() => move(chunk.id, 1)}
                  className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded border border-line bg-raised text-ink-2 transition-colors hover:text-ink disabled:opacity-30"
                >
                  ↓
                </button>
              </span>
            </div>
            <p className="t-small text-ink mt-1.5 max-w-[72ch] leading-relaxed text-xs md:text-sm">{chunk.text}</p>
            <p className="t-meta text-faint mt-1.5 font-mono text-xs" aria-hidden="true">
              来源：{chunk.source}
            </p>
            <span className="rank-track mt-2 max-w-[320px]" aria-hidden="true">
              <span
                className="rank-fill"
                data-poisoned={!fits ? "true" : undefined}
                style={{
                  transform: `scaleX(${Math.min(1, Math.max(tokens / maxTokens, RANK_FLOOR))})`,
                }}
              />
            </span>
          </li>
        ))}
      </ul>

      <div className="border-t border-line px-5 py-4 md:px-7 font-mono text-xs">
        <p className="t-meta text-ink-2" aria-live="polite">
          预算上限 {budget} tok (est.) · 已占用 {used} · 被截断段落数 {truncated} (budget {budget} tok (est.) · used {used} · truncated {truncated})
        </p>
        <p className="t-small text-ink-2 mt-2 max-w-[62ch] font-sans leading-relaxed">
          排列顺序直接决定了哪些文本能够存活于模型上下文内。重排序之所以至关重要，在于它在模型尚未开始生成之前，就已经裁决了哪些事实证据能够被模型获知。
        </p>
      </div>
    </div>
  );
}
