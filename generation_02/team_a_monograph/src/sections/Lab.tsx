import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Section } from "../components/Section";
import { RankRow } from "../components/RankRow";
import { chapters } from "../content/chapters";
import {
  chunkSizeDefault,
  chunkSizeMax,
  chunkSizeMin,
  chunkSource,
  labDemos,
  labReadouts,
  sandboxQuery,
  cleanCorpus,
  sandboxCorpus,
} from "../content/lab";
import { site } from "../content/site";
import { bm25Rank, chunkWords, toyDefense } from "../lib/retrieval";
import { EASE_SETTLE } from "../lib/motion-tokens";

interface RankedRow {
  id: string;
  score: number;
  poisoned: boolean;
  defenseFactor: number;
  defensePatterns: string[];
}

function ToggleButton({
  pressed,
  onClick,
  label,
}: {
  pressed: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={
        "t-mono-sm inline-flex min-h-[44px] items-center gap-2.5 border px-4 uppercase transition-colors duration-150 " +
        (pressed
          ? "border-accent-ink text-accent-ink"
          : "border-line-2 text-ink-2 hover:border-ink-3 hover:text-ink-1")
      }
    >
      <span
        aria-hidden="true"
        className={
          "inline-block h-1.5 w-1.5 rounded-full " +
          (pressed ? "bg-accent" : "border border-ink-3")
        }
      />
      {label} — {pressed ? "ON" : "OFF"}
    </button>
  );
}

/** L-01 — Corruption Sandbox. One forged passage rewrites the ranking. */
function CorruptionSandbox() {
  const [injected, setInjected] = useState(false);
  const [defended, setDefended] = useState(false);
  const reduce = useReducedMotion() ?? false;

  const corpus = useMemo(() => (injected ? sandboxCorpus : cleanCorpus), [injected]);
  const ranked: RankedRow[] = useMemo(() => {
    const base = bm25Rank(
      sandboxQuery,
      corpus.map((d) => ({ id: d.id, text: d.text })),
    );
    return base.map((r) => {
      const doc = corpus.find((d) => d.id === r.id);
      const verdict = defended && doc ? toyDefense(doc.text) : null;
      return {
        id: r.id,
        score: r.score * (verdict?.factor ?? 1),
        poisoned: doc?.poisoned ?? false,
        defenseFactor: verdict?.factor ?? 1,
        defensePatterns: verdict?.patterns ?? [],
      };
    });
  }, [corpus, defended]);

  const max = ranked[0]?.score ?? 1;
  const top = ranked.slice(0, 5);
  const below = ranked.length - top.length;

  return (
    <div className="mt-6">
      <div className="t-mono-sm flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1 text-ink-3">
        <p aria-live="polite">
          CORPUS {corpus.length} DOCUMENTS · QUERY “{sandboxQuery}”
        </p>
        <p aria-hidden="true">{labReadouts.method.toUpperCase()}</p>
      </div>

      <div className="mt-6 flex flex-wrap items-start gap-x-8 gap-y-4">
        <div>
          <ToggleButton
            pressed={injected}
            onClick={() => setInjected((v) => !v)}
            label={labReadouts.injectLabel}
          />
          <p className="t-body-sm mt-2 max-w-[38ch] text-ink-3">{labReadouts.injectDetail}</p>
        </div>
        <div>
          <ToggleButton
            pressed={defended}
            onClick={() => setDefended((v) => !v)}
            label={labReadouts.defenseLabel}
          />
          <p className="t-body-sm mt-2 max-w-[44ch] text-ink-3">{labReadouts.defenseDetail}</p>
        </div>
      </div>

      <motion.ol
        layout={!reduce}
        className="mt-8 border-y border-line-1 divide-y divide-line-1 px-0 py-2"
        aria-label="Top 5 ranked documents"
      >
        {top.map((r, i) => {
          const doc = corpus.find((d) => d.id === r.id);
          return (
            <motion.li
              key={r.id}
              layout={!reduce}
              transition={reduce ? { duration: 0 } : { duration: 0.24, ease: EASE_SETTLE }}
              className="list-none"
            >
              <RankRow
                rank={i + 1}
                max={max}
                doc={{
                  id: r.id,
                  snippet: doc?.text ?? "",
                  score: r.score,
                  poisoned: r.poisoned,
                  defenseFactor: r.defenseFactor,
                  defensePatterns: r.defensePatterns,
                }}
              />
            </motion.li>
          );
        })}
      </motion.ol>
      <p className="t-mono-sm mt-4 text-ink-4">
        {below} MORE DOCUMENT{below === 1 ? "" : "S"} BELOW THE CUT · SCORES BM25, NORMALIZED TO THE LEADER
      </p>
    </div>
  );
}

/** L-02 — Chunk Boundaries. Same engine, one parameter: the policy of size. */
function ChunkBoundaries() {
  const [size, setSize] = useState(chunkSizeDefault);
  const chunks = useMemo(() => chunkWords(chunkSource, size), [size]);
  const ranked = useMemo(
    () => bm25Rank(sandboxQuery, chunks.map((c) => ({ id: c.id, text: c.text }))),
    [chunks],
  );
  const topId = ranked[0]?.id;

  return (
    <div className="mt-16">
      <label htmlFor="chunk-size" className="t-mono-sm block uppercase text-ink-2">
        Chunk size — {size} words
      </label>
      <input
        id="chunk-size"
        type="range"
        min={chunkSizeMin}
        max={chunkSizeMax}
        step={2}
        value={size}
        aria-valuetext={`${size} words`}
        onChange={(e) => setSize(Number(e.target.value))}
        className="mt-2"
      />

      <p className="t-body leading-[2.1] text-ink-2">
        {chunks.map((c) => (
          <span
            key={c.id}
            className={
              "mr-3 inline-block border-l-2 py-0.5 pl-2 align-baseline " +
              (c.id === topId ? "border-accent bg-wash" : "border-line-1")
            }
          >
            <span
              className={"t-mono-sm mr-1.5 " + (c.id === topId ? "text-accent-ink" : "text-ink-4")}
            >
              {c.id}
            </span>
            {c.text}
          </span>
        ))}
      </p>

      <p className="t-mono-sm mt-5 text-ink-3" aria-live="polite">
        CHUNKS {chunks.length} · SIZE {size} WORDS · TOP {topId} · METHOD BM25 · 0MS NETWORK
      </p>
      <p className="t-body-sm mt-3 max-w-[68ch] text-ink-3">
        The best chunk for the sandbox query moves as the boundary moves. Chunk
        boundaries are policy decisions — see the note of the same title in §06.
      </p>
    </div>
  );
}

/**
 * §05 — the Lab: the monograph's most alive chapter. The one place with
 * status readouts, the accent at its most argumentative — and a permanent
 * honesty statement (stolen from E, kept in my voice).
 */
export function LabSection() {
  const chapter = chapters.find((c) => c.id === "lab")!;
  return (
    <Section chapter={chapter}>
      <p className="t-lede max-w-[54ch]">{site.labIntro}</p>
      <ol className="border-t border-line-1">
        {labDemos.map((d) => (
          <li key={d.id} className="flex flex-wrap items-baseline gap-x-6 gap-y-1 border-b border-line-1 py-4">
            <span className="t-mono text-ink-4">{d.label}</span>
            <span className="text-[17px] font-medium tracking-[-0.008em] text-ink-1">{d.title}</span>
            <span className="t-body-sm basis-full text-ink-3 sm:basis-auto sm:flex-1">{d.line}</span>
          </li>
        ))}
      </ol>

      <p className="t-mono-sm mt-10 flex items-baseline gap-2.5 text-ink-2">
        <span aria-hidden="true" className="inline-block h-1.5 w-1.5 shrink-0 translate-y-[-1px] rounded-full bg-accent" />
        {site.labHonesty.toUpperCase()}
      </p>

      <h3 className="t-title mt-12 text-ink-1">{labDemos[0].title}</h3>
      <CorruptionSandbox />

      <h3 className="t-title mt-16 text-ink-1">{labDemos[1].title}</h3>
      <ChunkBoundaries />
    </Section>
  );
}
