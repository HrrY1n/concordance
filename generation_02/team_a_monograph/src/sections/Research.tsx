import { Section } from "../components/Section";
import { Dot } from "../components/Dot";
import { chapters } from "../content/chapters";
import { researchQuestions, researchTopics } from "../content/research";
import type { QuestionStatus } from "../content/types";

const STATUS_TONE: Record<QuestionStatus, "alive" | "open" | "quiet"> = {
  active: "alive",
  open: "open",
  resting: "quiet",
};

/**
 * §02 — the research ledger. Directions as entries, questions as a numbered
 * ledger with statuses (the dot semantics: active = alive). No radar charts,
 * no dashboards — the professional signal is the phrasing of the questions.
 */
export function ResearchSection() {
  const chapter = chapters.find((c) => c.id === "research")!;
  return (
    <Section chapter={chapter}>
      <ol className="border-t border-line-1">
        {researchTopics.map((topic, i) => (
          <li
            key={topic.id}
            id={`topic-${topic.id}`}
            className="grid grid-cols-1 gap-y-1.5 border-b border-line-1 py-5 md:grid-cols-[2.75rem_1fr] md:gap-x-6"
          >
            <span aria-hidden="true" className="t-mono-sm pt-1 text-ink-4">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <h3 className="text-[17px] font-medium leading-snug tracking-[-0.008em] text-ink-1">
                {topic.name}
                <span className="t-mono-sm ml-3 hidden text-ink-4 md:inline">{topic.short}</span>
              </h3>
              <p className="t-body-sm mt-1.5 max-w-[62ch] text-ink-3">{topic.blurb}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-16">
        <h3 className="t-label text-ink-3">Open questions — the working ledger</h3>
        <ol className="mt-5 border-t border-line-1">
          {researchQuestions.map((q, i) => (
            <li
              key={q.id}
              id={`question-${q.id}`}
              className="grid grid-cols-[2.75rem_1fr] gap-x-4 border-b border-line-1 py-5"
            >
              <span aria-hidden="true" className="t-mono-sm pt-1 text-ink-4">
                Q{i + 1}
              </span>
              <div>
                <p className="t-body max-w-[62ch] text-ink-1">{q.text}</p>
                <p className="t-mono-sm mt-2.5 flex items-center gap-2 uppercase">
                  <Dot tone={STATUS_TONE[q.status]} />
                  <span className="text-ink-3">{q.status}</span>
                  {q.updated && <span className="text-ink-4">· {q.updated}</span>}
                </p>
              </div>
            </li>
          ))}
        </ol>
        <p className="t-mono-sm mt-6 text-ink-3">
          {researchQuestions.filter((q) => q.status === "active").length} ACTIVE ·{" "}
          {researchQuestions.length} IN THE LEDGER
        </p>
      </div>
    </Section>
  );
}
