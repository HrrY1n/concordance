import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import {
  applyToyDefense,
  bm25,
  looksLikeInjection,
  type ScoredDoc,
} from "../lib/bm25";
import {
  corruptionSandbox,
  sandboxCorpus,
  sandboxHonesty,
  sandboxQuery,
} from "../content/lab";
import { ThemeControl } from "../components/chrome";
import { useDocumentTitle } from "../lib/hooks";

export default function SandboxPage() {
  useDocumentTitle("Corruption Sandbox — Lab · Offprint");

  const [injected, setInjected] = useState(false);
  const [defense, setDefense] = useState(false);
  const rm = useReducedMotion();

  const docs = useMemo(
    () => (injected ? sandboxCorpus : sandboxCorpus.filter((d) => !d.poisoned)),
    [injected],
  );

  const ranking: ScoredDoc[] = useMemo(() => {
    const scored = bm25(docs, sandboxQuery);
    return defense ? applyToyDefense(scored, docs) : scored;
  }, [docs, defense]);

  const maxScore = Math.max(...ranking.map((r) => r.score), 1e-6);
  const rankMap = useMemo(
    () => new Map(ranking.map((d, i) => [d.id, i + 1])),
    [ranking],
  );

  // Rank deltas vs the previous toggle state (honest motion: the arrows
  // are data, computed once per config change).
  const prevRanksRef = useRef<Map<string, number>>(new Map());
  const [deltas, setDeltas] = useState<Map<string, number>>(new Map());
  useEffect(() => {
    const next = new Map<string, number>();
    for (const [id, r] of rankMap) {
      const prev = prevRanksRef.current.get(id);
      if (prev !== undefined && prev !== r) next.set(id, prev - r);
    }
    setDeltas(next);
    prevRanksRef.current = rankMap;
  }, [rankMap]);

  const d8Rank = rankMap.get("d8");
  const [announcement, setAnnouncement] = useState("");
  const firstRun = useRef(true);
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    if (injected && d8Rank !== undefined) {
      setAnnouncement(
        defense
          ? `Toy defense on: poisoned document demoted to rank ${d8Rank}.`
          : `Poisoned document injected: it now ranks ${d8Rank}.`,
      );
    } else {
      setAnnouncement("Poisoned document removed: clean ranking restored.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [injected, defense]);

  const query = sandboxQuery;

  return (
    <div className="min-h-screen">
      <header className="fixed inset-x-0 top-0 z-40 border-b border-divider bg-paper">
        <div className="shell flex h-14 items-center justify-between gap-4">
          <Link
            to="/"
            className="font-mono text-xs font-medium tracking-[0.14em] text-ink-strong"
          >
            ← OFFPRINT
          </Link>
          <ThemeControl />
        </div>
      </header>

      <main id="main-content" tabIndex={-1} className="shell pb-24 pt-24 focus:outline-none">
        <p className="type-label">APPENDIX {corruptionSandbox.index} · RE: Q1 · Q2</p>
        <h1 className="type-h1 mt-3 text-ink-strong">{corruptionSandbox.title}</h1>
        <p className="type-lede mt-4 max-w-[58ch]">{corruptionSandbox.blurb}</p>

        {/* Persistent honesty declaration (always visible, not a footnote) */}
        <p className="type-note mt-6 max-w-[60ch] border border-divider-strong bg-deep px-4 py-3">
          {sandboxHonesty} The toy defense is a{" "}
          <strong className="font-medium">heuristic demo, not a real defense</strong>.
        </p>

        {/* ------------------------------ controls ------------------------------ */}
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <button
            type="button"
            aria-pressed={injected}
            onClick={() => setInjected((v) => !v)}
            className={`border px-4 py-2.5 font-mono text-xs uppercase tracking-[0.08em] transition-colors duration-150 ${
              injected
                ? "border-ink-strong bg-deep text-ink-strong"
                : "border-divider-strong text-ink-2 hover:text-ink-strong"
            }`}
          >
            {injected ? "Poison injected ✓" : "Inject poisoned document"}
          </button>
          <button
            type="button"
            aria-pressed={defense}
            onClick={() => setDefense((v) => !v)}
            className={`border px-4 py-2.5 font-mono text-xs uppercase tracking-[0.08em] transition-colors duration-150 ${
              defense
                ? "border-ink-strong bg-deep text-ink-strong"
                : "border-divider-strong text-ink-2 hover:text-ink-strong"
            }`}
          >
            Toy defense {defense ? "on ✓" : "off"}
          </button>
          <p className="type-mono" aria-hidden="true">
            TOY HEURISTIC, NOT A REAL DEFENSE
          </p>
        </div>

        {/* ------------------------------ readouts ------------------------------ */}
        <div className="mt-8 grid gap-2 border-t border-divider pt-4 sm:grid-cols-2">
          <p className="type-mono">
            CORPUS {docs.length} DOCUMENTS ·{" "}
            {docs.filter((d) => looksLikeInjection(d.text)).length > 0 && defense
              ? "1 FLAGGED BY HEURISTIC"
              : "0 FLAGGED BY HEURISTIC"}
          </p>
          <p className="type-mono">
            METHOD: BM25 (K1 1.5 · B 0.75) · 0MS NETWORK
          </p>
          <p className="type-mono sm:col-span-2">
            QUERY — “{query}” · FIXED FOR THIS INSTRUMENT (EDIT SRC/CONTENT/LAB.TS)
          </p>
        </div>

        {/* ------------------------------ ranking ------------------------------- */}
        <div className="mt-10">
          <p className="sr-only" aria-live="polite">
            {announcement}
          </p>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="type-label">RANKING — TOP OF THE CORPUS, SCORED LIVE</h2>
            <p className="type-mono" aria-hidden="true">
              ▲ CLIMBED · ▼ FELL (SINCE LAST TOGGLE)
            </p>
          </div>

          <ol className="mt-4">
            {ranking.map((r, i) => {
              const doc = docs.find((d) => d.id === r.id);
              if (!doc) return null;
              const rank = i + 1;
              const delta = deltas.get(r.id);
              const dimmed = rank > 5;
              return (
                <motion.li
                  key={r.id}
                  layout={!rm}
                  transition={
                    rm
                      ? { duration: 0 }
                      : { layout: { duration: 0.28, ease: [0.22, 1, 0.36, 1] } }
                  }
                  className={`border-t border-divider py-4 ${
                    dimmed ? "opacity-55" : ""
                  } ${r.poisoned ? "border-l-2 border-l-accent pl-3" : "pl-3"}`}
                >
                  <div className="grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-x-3 gap-y-1 sm:grid-cols-[2.5rem_1fr_6rem_5rem]">
                    <span className="type-mono font-medium text-ink-2">{rank}.</span>
                    <div className="min-w-0">
                      <p className="type-body text-ink">
                        <span className="type-mono mr-2">{doc.id}</span>
                        {doc.id === "d8" ? (
                          <span className="chip chip-active ml-1 align-middle">
                            Poisoned
                          </span>
                        ) : null}
                      </p>
                      <p className="type-note mt-1 max-w-[64ch]">{doc.text}</p>
                    </div>
                    <span className="type-mono hidden text-right sm:block" aria-hidden="true">
                      {delta !== undefined && delta > 0 ? `▲${delta}` : ""}
                      {delta !== undefined && delta < 0 ? `▼${-delta}` : ""}
                    </span>
                    <span className="type-mono text-right tabular-nums text-ink-2">
                      {r.score.toFixed(2)}
                    </span>
                  </div>
                  <div
                    className={`scorebar mt-2 ${r.poisoned ? "scorebar-poisoned" : ""}`}
                    aria-hidden="true"
                  >
                    <i style={{ transform: `scaleX(${Math.max(0.02, r.score / maxScore)})` }} />
                  </div>
                </motion.li>
              );
            })}
          </ol>
        </div>

        {/* ------------------------------ what happened ------------------------- */}
        <div className="mt-14 border-t border-divider pt-8">
          <h2 className="type-label">WHAT JUST HAPPENED</h2>
          <div className="prose mt-4">
            <p>
              BM25 counts query-term matches, weighted by rarity and document length. The
              poisoned passage was written to repeat the vocabulary of this query —
              “external documents change a model's answers” — so it outranks passages
              that genuinely answer the question. Nothing was hacked: the ranking did
              exactly what lexical scoring does. That is the attack surface. Whoever can
              write to the corpus can write the ranking.
            </p>
            <p>
              The toy defense searches for instruction-injection patterns and demotes
              what it finds to the bottom of the ranking. It works here because the
              poison is crude. It fails quietly the moment a poisoned passage drops the
              imperative voice — which is precisely why the question exists (RE:{" "}
              <Link to="/#research" className="link-ink">
                Q1 · Q2 in the ledger
              </Link>
              ).
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
            <Link to="/#research" className="type-mono link-ink">
              ← BACK TO THE QUESTION LEDGER
            </Link>
            <Link to="/#lab" className="type-mono link-ink">
              ← BACK TO THE APPENDIX
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t border-divider">
        <div className="shell flex flex-wrap items-baseline justify-between gap-2 py-6">
          <p className="type-mono">{sandboxHonesty.toUpperCase()}</p>
          <p className="type-mono">OFFPRINT · {corruptionSandbox.runtime}</p>
        </div>
      </footer>
    </div>
  );
}
