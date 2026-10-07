import { profile } from "@/content/profile";
import { timeline } from "@/content/timeline";
import type { TimelineEntry } from "@/content/types";
import { useDocumentMeta } from "@/lib/seo";
import { PageShell } from "@/components/structure";
import { sectionByRoute } from "@/lib/sections";

/**
 * §06 ABOUT — prose in the essay register + a Now/Log (data-driven). The log
 * is deliberately NOT a résumé timeline: no connected dots, no dates as
 * decoration — a changelog of a person, replaceable in one file.
 */
const KIND_LABEL: Record<TimelineEntry["kind"], string> = {
  education: "education",
  research: "research",
  milestone: "milestone",
  elsewhere: "elsewhere",
};

export default function AboutPage() {
  useDocumentMeta(
    "About",
    "The about page of a research archive built as a concordance — plus a log, not a résumé. Biographical details appear here only once configured.",
  );
  const meta = sectionByRoute("/about")!;
  const sorted = timeline.filter((entry) => !entry.sample).slice().reverse();

  return (
    <PageShell meta={meta} register="essay" lede="Short by design: the archive itself is the longer answer.">
      <div className="u-measure">
        <p className="essay">{profile.about}</p>
        {profile.aboutZh ? (
          <p className="essay mt-4" lang="zh">
            {profile.aboutZh}
          </p>
        ) : null}
        {profile.location ? (
          <p className="t-meta text-ink-2 mt-5">located — {profile.location}</p>
        ) : null}
        {profile.name === null ? (
          <p className="t-meta text-ink-2 mt-2">name — not yet configured</p>
        ) : (
          <p className="t-meta text-ink-2 mt-2">{profile.name}</p>
        )}
      </div>

      {/* Now/Log — changelog grammar, no résumé styling. Hidden entirely
          while no real entry exists: an empty log is not a page. */}
      {sorted.length > 0 ? (
      <section aria-labelledby="about-log" className="mt-16 max-w-[54rem]">
        <h2 id="about-log" className="t-kicker text-ink-2">
          log — now and then
        </h2>
        <ul className="mt-5">
          {sorted.map((entry, i) => (
            <li
              key={`${entry.year}-${entry.title}-${i}`}
              className="grid grid-cols-[5.5rem_1fr] gap-x-6 border-t border-line py-4 first:border-t-0"
            >
              <span className="t-meta text-accent">{entry.year}</span>
              <div>
                <p className="t-small text-ink">
                  <span className="t-meta t-caps text-ink-2 mr-3">{KIND_LABEL[entry.kind]}</span>
                  {entry.title}
                </p>
                <p className="t-small text-ink-2 mt-1">{entry.detail}</p>
              </div>
            </li>
          ))}
        </ul>
        <p className="t-meta text-ink-2 mt-5 max-w-[58ch]">
          the log replaces a résumé timeline: newest line first, every line replaceable in the
          content files.
        </p>
      </section>
      ) : null}
    </PageShell>
  );
}
