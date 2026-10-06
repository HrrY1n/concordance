import { researchQuestions, researchTopics } from "@/content/research";
import { sectionByRoute } from "@/lib/sections";
import { usePageMeta } from "@/lib/seo";
import { PageShell, Section } from "@/components/structure";

function StatusMark({ status }: { status: "active" | "open" | "resting" }) {
  if (status === "active") {
    return (
      <span className="inline-flex items-center gap-2">
        <span aria-hidden="true" className="inline-block h-2 w-2 rounded-full bg-accent" />
        <span>active</span>
      </span>
    );
  }
  if (status === "open") {
    return (
      <span className="inline-flex items-center gap-2">
        <span aria-hidden="true" className="inline-block h-2 w-2 rounded-full border border-muted" />
        <span>open</span>
      </span>
    );
  }
  return <span>resting</span>;
}

/** Directions ledger + Question Ledger (the ledger itself is borrowed from D). */
export function ResearchContent() {
  return (
    <>
      <p className="t-small text-muted max-w-[64ch]">
        Six directions, four live questions. Status words are self-descriptions, not progress
        claims.
      </p>

      <ul className="mt-8 border-t border-line">
        {researchTopics.map((topic) => (
          <li
            key={topic.id}
            id={topic.id}
            className="grid gap-2 border-b border-line py-5 scroll-mt-24 md:grid-cols-12 md:gap-6"
          >
            <span className="t-meta text-faint pt-1 md:col-span-1" aria-hidden="true">
              R-{String(topic.order).padStart(2, "0")}
            </span>
            <div className="md:col-span-11">
              <h3 className="t-entry">{topic.name}</h3>
              <p className="t-small text-muted mt-1 max-w-[66ch]">{topic.blurb}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-14">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          <h3 className="t-kicker text-muted">question ledger</h3>
          <p className="t-meta t-caps text-faint">sample entries</p>
        </div>
        <ul className="mt-4 border-t border-line">
          {researchQuestions.map((question) => (
            <li key={question.id} className="grid gap-3 border-b border-line py-6 md:grid-cols-12">
              <span className="t-meta text-faint pt-1 md:col-span-1" aria-hidden="true">
                {question.id.toUpperCase()}
              </span>
              <div className="md:col-span-10">
                <p className="t-h4 max-w-[52ch]">{question.text}</p>
                <p className="t-meta t-caps text-muted mt-3">
                  <StatusMark status={question.status} />
                  <span aria-hidden="true"> · </span>
                  updated {question.updated ?? "—"}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export function ResearchSection() {
  return (
    <Section
      meta={sectionByRoute("/research")!}
      lede="What this index is about: the directions below are the corpus's main headings."
    >
      <ResearchContent />
    </Section>
  );
}

export function ResearchPage() {
  usePageMeta("Research");
  return (
    <PageShell
      meta={sectionByRoute("/research")!}
      lede="Six directions and four live questions. Status words are self-descriptions, not progress claims."
    >
      <ResearchContent />
    </PageShell>
  );
}
