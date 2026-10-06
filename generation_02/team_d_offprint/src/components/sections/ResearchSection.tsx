import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { researchQuestions, researchTopics } from "../../content/research";
import { labInstruments } from "../../content/lab";
import { Noted, NoteMark, Reveal, SectionHead } from "../../components/chrome";
import type { QuestionStatus } from "../../content/types";

const STATUS_LABEL: Record<QuestionStatus, string> = {
  active: "Active",
  open: "Open",
  resting: "Resting",
};

function StatusChip({ status }: { status: QuestionStatus }) {
  const cls =
    status === "active" ? "chip chip-active" : status === "resting" ? "chip chip-resting" : "chip";
  return <span className={cls}>{STATUS_LABEL[status]}</span>;
}

export function ResearchSection() {
  const [filter, setFilter] = useState<string | null>(null);

  const applyFilter = useCallback((topicId: string) => {
    setFilter(topicId);
    const el = document.getElementById("ledger");
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const filtered = filter
    ? researchQuestions.filter((q) => q.topic === filter)
    : researchQuestions;
  const filterTopic = researchTopics.find((t) => t.id === filter) ?? null;

  return (
    <section id="research" className="section scroll-mt-14">
      <div className="shell">
        <Reveal>
          <SectionHead
            num="01"
            kicker="The Question Ledger"
            title="Questions I am currently asking."
            lede="Numbered, statused, dated when there is a date. The statuses are working states, not rhetoric."
          />
        </Reveal>

        {/* -------- Directions: the map, retired into typography -------- */}
        <div className="mt-14">
          <p className="type-label">FIELDS IN ROTATION</p>
          <ul className="mt-4">
            {researchTopics.map((t, i) => {
              const qs = researchQuestions.filter((q) => q.topic === t.id);
              const openCount = qs.filter((q) => q.status !== "resting").length;
              return (
                <Reveal key={t.id} delay={Math.min(i * 0.04, 0.2)}>
                  <li className="grid gap-3 border-t border-divider py-6 lg:grid-cols-[minmax(0,60ch)_minmax(0,21ch)] lg:gap-x-16">
                    <div>
                      <p className="type-mono">
                        T{String(t.order).padStart(2, "0")}
                      </p>
                      <button
                        type="button"
                        onClick={() => applyFilter(t.id)}
                        className="type-h3 mt-1 block text-left text-ink-strong underline-offset-4 hover:underline hover:decoration-divider-strong"
                        aria-label={`Show the ${t.name} questions in the ledger`}
                      >
                        {t.name}
                      </button>
                      <p className="type-body mt-2 text-ink-soft">{t.blurb}</p>
                    </div>
                    <div className="lg:pt-6 lg:text-right">
                      <p className="type-mono">
                        {openCount > 0
                          ? `${openCount} QUESTION${openCount === 1 ? "" : "S"} OPEN`
                          : "NO OPEN QUESTIONS"}
                      </p>
                      <p className="type-mono mt-2">
                        ADJOINS{" "}
                        {t.adjoins.map((id, j) => {
                          const adj = researchTopics.find((x) => x.id === id);
                          if (!adj) return null;
                          return (
                            <span key={id}>
                              {j > 0 ? " · " : "— "}
                              <button
                                type="button"
                                onClick={() => applyFilter(adj.id)}
                                className="link-quiet font-mono"
                              >
                                {adj.short}
                              </button>
                            </span>
                          );
                        })}
                      </p>
                    </div>
                  </li>
                </Reveal>
              );
            })}
          </ul>
          <Noted
            n={1}
            note={
              <>
                Adjacency is my own judgment of which fields lean on which — declared in
                data, rendered as text. The round-one SVG node map was retired on purpose:
                a graph you have to re-layout by hand every time a question changes is a
                liability, not a map.
              </>
            }
          >
            The relationship between fields is stated, not drawn
            <NoteMark n={1} />.
          </Noted>
        </div>

        {/* ------------------------ Question Ledger ------------------------ */}
        <div id="ledger" className="mt-16 scroll-mt-20">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <p className="type-label">THE LEDGER</p>
            <p className="type-label">
              ACTIVE — BEING ASKED NOW · OPEN — ON THE LIST · RESTING — PARKED, HONESTLY
            </p>
          </div>

          <div className="mt-3 flex min-h-8 items-center gap-3" aria-live="polite">
            {filterTopic ? (
              <>
                <button
                  type="button"
                  onClick={() => setFilter(null)}
                  className="chip chip-active cursor-pointer"
                  aria-label={`Remove the ${filterTopic.name} filter`}
                >
                  Filter: {filterTopic.short} ×
                </button>
                <span className="sr-only">
                  {filtered.length} question{filtered.length === 1 ? "" : "s"} shown after
                  filtering by {filterTopic.name}.
                </span>
              </>
            ) : null}
          </div>

          <ul className="mt-2">
            {filtered.map((q, i) => {
              const instrument = q.relatedDemo
                ? labInstruments.find((l) => l.id === q.relatedDemo)
                : undefined;
              const topic = researchTopics.find((t) => t.id === q.topic);
              return (
                <Reveal key={q.id} delay={Math.min(i * 0.04, 0.16)}>
                  <li className="grid gap-2 border-t border-divider py-6 lg:grid-cols-[minmax(0,60ch)_minmax(0,21ch)] lg:gap-x-16">
                    <div className="flex gap-4">
                      <span
                        className={`type-mono mt-1 text-base font-medium ${
                          q.status === "active" ? "text-accent" : "text-ink-soft"
                        }`}
                      >
                        {q.id.toUpperCase()}
                      </span>
                      <p className="type-h3 max-w-[48ch] text-ink">{q.text}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 pl-9 lg:flex-col lg:items-end lg:gap-2 lg:pl-0 lg:pt-1 lg:text-right">
                      <StatusChip status={q.status} />
                      {q.updated ? (
                        <p className="type-mono">UPD {q.updated}</p>
                      ) : null}
                      {topic ? (
                        <button
                          type="button"
                          onClick={() => applyFilter(topic.id)}
                          className="type-mono link-quiet"
                        >
                          {topic.short.toUpperCase()}
                        </button>
                      ) : null}
                      {instrument ? (
                        <Link
                          to={instrument.path}
                          className="type-mono link-ink font-medium"
                        >
                          → RUN IT IN THE LAB
                        </Link>
                      ) : null}
                    </div>
                  </li>
                </Reveal>
              );
            })}
          </ul>
          <p className="type-mono border-t border-divider pt-3">
            {filtered.length} OF {researchQuestions.length} QUESTIONS SHOWN —{" "}
            {filter ? "FILTERED" : "THE FULL LEDGER"}
          </p>
        </div>
      </div>
    </section>
  );
}
