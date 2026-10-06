import { useMemo } from "react";
import { Link } from "react-router-dom";
import { DEMO_REGISTRY } from "@/content/ids";
import { researchQuestions, researchTopics } from "@/content/research";
import { useDocumentMeta } from "@/lib/seo";
import { useSearch } from "@/lib/palette";
import { Figure, PageShell, XRef } from "@/components/structure";
import { sectionByRoute } from "@/lib/sections";
import type { QuestionStatus } from "@/content/types";

const STATUS_LEGEND: Record<QuestionStatus, { label: string; tone: string; meaning: string }> = {
  active: { label: "active", tone: "accent", meaning: "currently working" },
  exploring: { label: "exploring", tone: "exploring", meaning: "reading, probing, not committed" },
  paused: { label: "paused", tone: "paused", meaning: "kept visible on purpose" },
};

function StatusMark({ status }: { status: QuestionStatus }) {
  const legend = STATUS_LEGEND[status];
  return (
    <span className="t-meta t-caps inline-flex items-center gap-2 text-ink-2">
      <span className="dot" data-tone={legend.tone} aria-hidden="true" />
      {legend.label}
    </span>
  );
}

/** FIG.R1 — the ledger's own distribution, computed from the question data. */
function StatusDistribution() {
  const counts = useMemo(() => {
    const order: QuestionStatus[] = ["active", "exploring", "paused"];
    return order.map((status) => ({
      status,
      n: researchQuestions.filter((q) => q.status === status).length,
    }));
  }, []);
  const total = researchQuestions.length;
  return (
    <Figure
      id="FIG. R1"
      title="Question ledger — status distribution"
      method={`computed from research.ts · n = ${total} · 0ms network`}
    >
      <div
        className="flex h-8 w-full max-w-[560px] border border-line"
        role="img"
        aria-label={`Status distribution: ${counts
          .filter((c) => c.n > 0)
          .map((c) => `${c.n} ${c.status}`)
          .join(", ")}.`}
      >
        {counts.map(({ status, n }) =>
          n === 0 ? null : (
            <span
              key={status}
              className={
                status === "active"
                  ? "border-r border-line bg-accent/80"
                  : status === "exploring"
                    ? "border-r border-line bg-ink-2/60"
                    : "bg-transparent"
              }
              style={{ width: `${(n / total) * 100}%` }}
              title={`${status}: ${n}`}
            />
          ),
        )}
      </div>
      <p className="t-meta text-ink-2 mt-3">
        {counts.map((c) => `${c.status} ${c.n}`).join(" · ")}
      </p>
    </Figure>
  );
}

export default function ResearchPage() {
  useDocumentMeta(
    "Research",
    "Research directions and the question ledger: retrieval-augmented generation, robustness, knowledge poisoning, AI security, systems, and the retrieval–generation interaction.",
  );
  const { openSearch } = useSearch();
  const meta = sectionByRoute("/research")!;

  return (
    <PageShell meta={meta} lede="Directions are stable; questions move. The ledger below is the working state — numbered, dated where honesty allows, and never staged.">
      {/* ——— directions (LEDGER register) ——— */}
      <section aria-labelledby="research-directions">
        <h2 id="research-directions" className="t-kicker text-ink-2">
          directions — {researchTopics.length}
        </h2>
        <ul className="mt-5">
          {researchTopics.map((t) => (
            <li key={t.id} id={t.id} className="scroll-mt-24 border-t border-line py-6 first:border-t-0">
              <div className="grid gap-x-8 gap-y-2 md:grid-cols-[4rem_1fr]">
                <span className="t-meta text-accent">{t.short}</span>
                <div className="max-w-[62ch]">
                  <h3 className="t-h4">{t.name}</h3>
                  <p className="t-small text-ink-2 mt-2">{t.blurb}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                    <span className="t-meta text-faint" aria-hidden="true">
                      adjoins
                    </span>
                    {t.adjoins.map((a) => {
                      const adj = researchTopics.find((x) => x.id === a)!;
                      return (
                        <button
                          key={a}
                          type="button"
                          className="u-chip !px-2.5"
                          onClick={() => openSearch(adj.short)}
                          aria-label={`Search the site for “${adj.short}”`}
                        >
                          {adj.short} <span aria-hidden="true">⌕</span>
                        </button>
                      );
                    })}
                    {t.relatedDemo ? (
                      <XRef to={DEMO_REGISTRY[t.relatedDemo].route}>
                        demo: {DEMO_REGISTRY[t.relatedDemo].title}
                      </XRef>
                    ) : null}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* ——— ledger status, as a figure ——— */}
      <div className="mt-12">
        <StatusDistribution />
      </div>

      {/* ——— the Question Ledger (D's grammar, low-maintenance statuses) ——— */}
      <section aria-labelledby="research-ledger" className="mt-12">
        <h2 id="research-ledger" className="t-kicker text-ink-2">
          question ledger — {researchQuestions.length} questions
        </h2>
        <ol className="mt-5">
          {researchQuestions.map((q, i) => (
            <li
              key={q.id}
              id={q.id}
              className="scroll-mt-24 border-t border-line py-6 first:border-t-0 md:grid md:grid-cols-[6rem_1fr] md:gap-x-8"
            >
              <div className="flex items-baseline gap-3 md:block">
                <span className="t-meta text-faint" aria-hidden="true">
                  Q{String(i + 1).padStart(2, "0")}
                </span>
                <span className="t-meta text-ink-2 md:hidden" aria-hidden="true">
                  ·
                </span>
                <StatusMark status={q.status} />
              </div>
              <div>
                <p className="t-h4 max-w-[54ch]">{q.text}</p>
                <div className="mt-3 flex flex-wrap items-baseline gap-x-5 gap-y-1">
                  <span className="t-meta text-ink-2">topic: {q.topic}</span>
                  {q.updated ? (
                    <span className="t-meta text-ink-2">updated {q.updated}</span>
                  ) : null}
                  {q.relatedDemo ? (
                    <XRef to={DEMO_REGISTRY[q.relatedDemo].route}>
                      run: {DEMO_REGISTRY[q.relatedDemo].title}
                    </XRef>
                  ) : null}
                </div>
              </div>
            </li>
          ))}
        </ol>

        {/* the one legend the ledger needs */}
        <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2 border-t border-line pt-4">
          {(Object.keys(STATUS_LEGEND) as QuestionStatus[]).map((s) => (
            <span key={s} className="t-meta text-ink-2 inline-flex items-center gap-2">
              <span className="dot" data-tone={STATUS_LEGEND[s].tone} aria-hidden="true" />
              {s} — {STATUS_LEGEND[s].meaning}
            </span>
          ))}
        </div>
        <p className="t-small text-ink-2 mt-4 max-w-[58ch]">
          A question joins the ledger when it can be stated in one sentence. It leaves when it is
          answered, dead, or someone else published the answer first — each exit is a different
          line in the notes.{" "}
          <Link to="/notes" className="u-link">
            Related notes →
          </Link>
        </p>
      </section>
    </PageShell>
  );
}
