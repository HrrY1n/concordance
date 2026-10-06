import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { bm25Rank } from "@/lib/bm25";
import { budgetChunks, budgetQuestion, sandboxCorpus, sandboxQuery, toyDefense } from "@/content/lab";
import type { SandboxDoc } from "@/content/types";
import { sectionByRoute } from "@/lib/sections";
import { usePageMeta } from "@/lib/seo";
import { PageShell, Section } from "@/components/structure";

/**
 * Shared rank row. Bars grow with scaleX (transform-only); scores are real
 * BM25 numbers. The poisoned row is never color-only: ▲ POISONED label + a
 * filled left border + a text label in the live region.
 */
function RankRow({
  rank,
  doc,
  score,
  max,
}: {
  rank: number;
  doc: SandboxDoc;
  score: number;
  max: number;
}) {
  const poisoned = Boolean(doc.poisoned);
  return (
    <li className="flex items-center gap-3 border-b border-line py-2 last:border-b-0">
      <span className="t-meta text-faint w-6 shrink-0 text-right" aria-hidden="true">
        {rank}
      </span>
      <span className={`t-meta shrink-0 ${poisoned ? "text-signal" : "text-muted"}`}>
        {doc.id}
      </span>
      {poisoned ? <span className="t-meta t-caps text-signal shrink-0">▲ poisoned</span> : null}
      <span className="relative h-1.5 min-w-8 flex-1 bg-line/60" aria-hidden="true">
        <span
          className={`rank-fill absolute inset-0 ${poisoned ? "bg-signal" : "bg-faint"}`}
          style={{ transform: `scaleX(${max > 0 ? Math.max(score / max, 0) : 0})` }}
        />
      </span>
      <span className="t-meta text-muted w-14 shrink-0 text-right">
        {score.toFixed(2)}
      </span>
    </li>
  );
}

function RankList({
  corpus,
  withDefense,
}: {
  corpus: SandboxDoc[];
  withDefense: boolean;
}) {
  const ranked = useMemo(
    () =>
      bm25Rank(
        corpus,
        sandboxQuery,
        withDefense
          ? { defense: { patterns: toyDefense.patterns, factor: toyDefense.factor } }
          : {},
      ),
    [corpus, withDefense],
  );
  const top5 = ranked.slice(0, 5);
  const max = top5[0]?.score ?? 1;
  const docById = useMemo(() => new Map(sandboxCorpus.map((d) => [d.id, d])), []);

  return (
    <ol aria-label="Ranking, top 5">
      {top5.map((entry, i) => {
        const doc = docById.get(entry.id);
        return doc ? (
          <RankRow key={entry.id} rank={i + 1} doc={doc} score={entry.score} max={max} />
        ) : null;
      })}
    </ol>
  );
}

const stageBtn =
  "t-small min-h-[44px] border px-4 transition-colors border-line text-muted hover:text-ink hover:border-muted";
const stageBtnPressed = "t-small min-h-[44px] border px-4 border-ink bg-hover text-ink";

/** Demo 01 — the Corruption Sandbox (CONTENT_PACK spec, acceptance-tested). */
export function Sandbox() {
  const [injected, setInjected] = useState(false);
  const [defense, setDefense] = useState(false);

  const corpus = useMemo(
    () => (injected ? sandboxCorpus : sandboxCorpus.filter((d) => !d.poisoned)),
    [injected],
  );
  const ranked = useMemo(
    () =>
      bm25Rank(
        corpus,
        sandboxQuery,
        defense
          ? { defense: { patterns: toyDefense.patterns, factor: toyDefense.factor } }
          : {},
      ),
    [corpus, defense],
  );
  const topId = ranked[0]?.id ?? "—";
  const topScore = ranked[0]?.score ?? 0;

  const liveMessage = injected
    ? defense
      ? `Poisoned document injected, toy defense on. Top result ${topId}. The poisoned document left the top three.`
      : `Poisoned document injected. Top result ${topId}, score ${topScore.toFixed(2)} — the poisoned document ranks first.`
    : `Clean corpus. Top result ${topId}.`;

  return (
    <div className="border border-line bg-surface-2 p-5 md:p-8">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <p className="t-meta text-muted break-words">
          query <span className="text-ink">“{sandboxQuery}”</span>
        </p>
        <p className="t-meta t-caps text-faint">
          documents: {corpus.length} · method: bm25 · 0ms network
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          aria-pressed={injected}
          onClick={() => setInjected((v) => !v)}
          className={injected ? stageBtnPressed : stageBtn}
        >
          {injected ? "Remove the poisoned document" : "Inject poisoned document (d8)"}
        </button>
        <button
          type="button"
          aria-pressed={defense}
          onClick={() => setDefense((v) => !v)}
          className={defense ? stageBtnPressed : stageBtn}
        >
          {defense ? "Disable toy defense" : "Enable toy defense"}
        </button>
        {defense ? (
          <p className="t-meta t-caps text-muted self-center break-words">{toyDefense.label}</p>
        ) : null}
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        <div>
          <h3 className="t-kicker text-muted">corpus — {corpus.length} documents</h3>
          <ul className="mt-4 space-y-3">
            {corpus.map((doc) => {
              const poisoned = Boolean(doc.poisoned);
              return (
                <li
                  key={doc.id}
                  className={`pl-3 ${poisoned ? "border-l-2 border-signal" : "border-l border-line"}`}
                >
                  <p className="t-meta flex flex-wrap items-baseline gap-x-3">
                    <span className={poisoned ? "text-signal" : "text-muted"}>{doc.id}</span>
                    {poisoned ? <span className="t-caps text-signal">▲ poisoned</span> : null}
                  </p>
                  <p className="t-small text-muted mt-1">{doc.text}</p>
                </li>
              );
            })}
          </ul>
        </div>

        <div>
          <h3 className="t-kicker text-muted">ranking — top 5</h3>
          <div className="mt-4">
            <RankList corpus={corpus} withDefense={defense} />
          </div>
          <p className="t-small text-muted mt-6 max-w-[52ch]">
            One passage at the top of this list is treated as evidence — regardless of how it got
            there. That is the whole attack.
          </p>
        </div>
      </div>

      <p aria-live="polite" className="sr-only">
        {liveMessage}
      </p>

      <div className="t-meta t-caps text-faint mt-8 border-t border-line pt-4">
        <p>
          illustrative toy — lexical scoring on a hand-written corpus. not a claim about real
          systems.
        </p>
      </div>
    </div>
  );
}

/** Demo 02 — Context Budget: order decides what fits; that is reranking. */
export function ContextBudget() {
  const [budget, setBudget] = useState(256);
  const [order, setOrder] = useState<string[]>(budgetChunks.map((c) => c.id));

  const chunks = order
    .map((id) => budgetChunks.find((c) => c.id === id))
    .filter((c): c is (typeof budgetChunks)[number] => Boolean(c));

  let used = 0;
  const states = chunks.map((chunk) => {
    const tokens = Math.ceil(chunk.text.length / 4);
    const fits = used + tokens <= budget;
    if (fits) used += tokens;
    return { chunk, tokens, fits };
  });
  const truncated = states.filter((s) => !s.fits).length;

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
    <div className="border border-line bg-surface-2 p-5 md:p-8">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <p className="t-meta text-muted break-words">
          query <span className="text-ink">“{budgetQuestion}”</span>
        </p>
        <p className="t-meta t-caps text-faint">counts = chars ÷ 4 (est.) · 0ms network</p>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <label htmlFor="budget-slider" className="t-small text-muted">
          Token budget
        </label>
        <input
          id="budget-slider"
          type="range"
          min={64}
          max={640}
          step={16}
          value={budget}
          onChange={(event) => setBudget(Number(event.target.value))}
          style={{ accentColor: "var(--accent)" }}
          className="min-h-[44px] min-w-[200px] flex-1"
        />
        <output htmlFor="budget-slider" className="t-meta text-ink">
          {budget} tok
        </output>
      </div>

      <ul className="mt-6 space-y-2">
        {states.map(({ chunk, tokens, fits }, i) => (
          <li
            key={chunk.id}
            className={`border px-4 py-3 ${
              fits ? "border-line" : "border-dashed border-signal/60 opacity-75"
            }`}
          >
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="t-meta text-faint">{chunk.id}</span>
              <span className="t-meta text-muted">{tokens} tok est.</span>
              {!fits ? <span className="t-meta t-caps text-signal">▲ truncated</span> : null}
              <span className="ml-auto flex">
                <button
                  type="button"
                  aria-label={`Move ${chunk.id} up`}
                  disabled={i === 0}
                  onClick={() => move(chunk.id, -1)}
                  className="flex min-h-[44px] min-w-[44px] items-center justify-center text-muted hover:text-ink transition-colors disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  type="button"
                  aria-label={`Move ${chunk.id} down`}
                  disabled={i === states.length - 1}
                  onClick={() => move(chunk.id, 1)}
                  className="flex min-h-[44px] min-w-[44px] items-center justify-center text-muted hover:text-ink transition-colors disabled:opacity-30"
                >
                  ↓
                </button>
              </span>
            </div>
            <p className="t-small text-muted mt-1 max-w-[72ch]">{chunk.text}</p>
            <p className="t-meta text-faint mt-1">{chunk.source}</p>
          </li>
        ))}
      </ul>

      <p className="t-meta t-caps text-faint mt-5">
        budget: {budget} tok (est.) · used: {used} · truncated: {truncated}
      </p>
      <p className="t-small text-muted mt-2 max-w-[60ch]">
        Order decides what fits. That is why reranking matters — it is a decision about which
        evidence exists, made before the model ever speaks.
      </p>
    </div>
  );
}

/** Home teaser: the stage computes a REAL ranking of the clean corpus. */
export function LabSection() {
  return (
    <Section
      meta={sectionByRoute("/lab")!}
      lede="Two offline instruments for the ideas above. Everything computes in your browser; nothing phones home."
    >
      <div className="border border-line bg-surface-2 p-5 md:p-8">
        <p className="t-meta text-muted break-words">
          query <span className="text-ink">“{sandboxQuery}”</span>
        </p>
        <p className="t-meta t-caps text-faint mt-1">
          top 3 of 7 documents · method: bm25 · 0ms network
        </p>
        <div className="mt-5 max-w-[560px]">
          <RankList
            corpus={sandboxCorpus.filter((d) => !d.poisoned)}
            withDefense={false}
          />
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-x-8 gap-y-3 border-t border-line pt-4">
          <p className="t-meta t-caps text-faint max-w-[46ch]">
            illustrative toy — lexical scoring on a hand-written corpus
          </p>
          <Link to="/lab" className="u-link t-small">
            Open the sandbox <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </Section>
  );
}

export function LabPage() {
  usePageMeta("Lab");
  return (
    <PageShell
      meta={sectionByRoute("/lab")!}
      lede="Two offline instruments for the research directions. Both compute entirely in your browser; nothing phones home, and every reading is real arithmetic on hand-written data."
    >
      <div className="space-y-16">
        <section aria-labelledby="demo-sandbox-title">
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
            <h2 id="demo-sandbox-title" className="t-kicker text-muted">
              demo 01 — corruption sandbox
            </h2>
            <p className="t-meta t-caps text-faint">inject · rank · defend</p>
          </div>
          <div className="mt-5">
            <Sandbox />
          </div>
        </section>

        <section aria-labelledby="demo-budget-title">
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
            <h2 id="demo-budget-title" className="t-kicker text-muted">
              demo 02 — context budget
            </h2>
            <p className="t-meta t-caps text-faint">order · fit · truncate</p>
          </div>
          <div className="mt-5">
            <ContextBudget />
          </div>
        </section>
      </div>
    </PageShell>
  );
}
