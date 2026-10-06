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
 * L-02 — Context Budget. A token budget and five chunks in an order you
 * control. Order decides what fits; that is why reranking matters. Token
 * counts are the honest estimate (chars ÷ 4) and every row is labeled est.
 */
export function ContextBudget() {
  const [budget, setBudget] = useState(budgetDefault);
  const [order, setOrder] = useState<string[]>(budgetChunks.map((c) => c.id));

  const chunks = order
    .map((id) => budgetChunks.find((c) => c.id === id))
    .filter((c): c is (typeof budgetChunks)[number] => Boolean(c));

  // Pure pass: tokens are the honest chars ÷ 4 estimate; a chunk fits when
  // everything before it plus itself stays inside the budget.
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
    <div className="border border-line-strong bg-inset">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-line px-5 py-4 md:px-7">
        <p className="t-meta text-ink-2 break-words">
          query <span className="text-ink">“{budgetQuestion}”</span>
        </p>
        <p className="t-meta t-caps text-ink-2">counts = chars ÷ 4 (est.) · 0ms network</p>
      </div>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-line px-5 py-4 md:px-7">
        <label htmlFor="budget-slider" className="t-small text-ink-2">
          Token budget
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
        <output htmlFor="budget-slider" className="t-meta text-ink">
          {budget} tok
        </output>
      </div>

      <ul className="px-5 py-5 md:px-7">
        {states.map(({ chunk, tokens, fits }, i) => (
          <li key={chunk.id} className="border-b border-line py-4 last:border-b-0">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="t-meta text-ink-2">{chunk.id}</span>
              <span className="t-meta text-ink-2">{tokens} tok est.</span>
              {fits ? (
                <span className="t-meta t-caps text-ok">▲ fits</span>
              ) : (
                <span className="t-meta t-caps text-signal" data-flag="truncated">
                  ▼ truncated
                </span>
              )}
              <span className="ml-auto flex items-center">
                <button
                  type="button"
                  aria-label={`Move ${chunk.id} up`}
                  disabled={i === 0}
                  onClick={() => move(chunk.id, -1)}
                  className="flex min-h-[44px] min-w-[44px] items-center justify-center text-ink-2 transition-colors hover:text-ink disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  type="button"
                  aria-label={`Move ${chunk.id} down`}
                  disabled={i === states.length - 1}
                  onClick={() => move(chunk.id, 1)}
                  className="flex min-h-[44px] min-w-[44px] items-center justify-center text-ink-2 transition-colors hover:text-ink disabled:opacity-30"
                >
                  ↓
                </button>
              </span>
            </div>
            <p className="t-small text-ink-2 mt-1 max-w-[72ch]">{chunk.text}</p>
            <p className="t-meta text-faint mt-2" aria-hidden="true">
              {chunk.source}
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

      <div className="border-t border-line px-5 py-4 md:px-7">
        <p className="t-meta t-caps text-ink-2">
          budget {budget} tok (est.) · used {used} · truncated {truncated}
        </p>
        <p className="t-small text-ink-2 mt-2 max-w-[60ch]">
          Order decides what fits. That is why reranking matters — it is a decision about which
          evidence exists, made before the model ever speaks.
        </p>
      </div>
    </div>
  );
}
