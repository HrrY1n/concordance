import { Link } from "react-router-dom";
import { sectionByRoute } from "@/lib/sections";
import { usePageMeta } from "@/lib/seo";
import { PageShell, Section } from "@/components/structure";

/**
 * The one intentionally-present empty state. Etiquette borrowed from B
 * ("call for papers"), counting language borrowed from C ("0 RECORDS"),
 * ghost slots aria-hidden. No fake papers, no "coming soon" spinners.
 */
export function PublicationsContent() {
  return (
    <>
      <div className="max-w-[56ch]">
        <p className="t-lead">
          Nothing in print yet — this space is reserved for peer-reviewed work.
        </p>
        <p className="t-meta t-caps text-muted mt-6">
          status: call for papers — selected research will appear here
        </p>
      </div>

      {/* Ghost slots: the shelf exists, the volumes do not. Decorative, hidden. */}
      <div className="mt-10 border-y border-line" aria-hidden="true">
        {[1, 2].map((slot) => (
          <div
            key={slot}
            className={`flex h-16 items-center justify-between px-4 ${
              slot === 1 ? "border-b border-dashed border-line" : ""
            }`}
          >
            <span className="t-meta text-faint">reserved</span>
            <span className="t-meta text-faint">pub-{String(slot).padStart(2, "0")}</span>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-x-10 gap-y-2">
        <Link to="/research" className="u-link t-small">
          The research is already visible <span aria-hidden="true">→</span>
        </Link>
        <Link to="/notes" className="u-link t-small">
          Working notes appear first <span aria-hidden="true">→</span>
        </Link>
      </div>
    </>
  );
}

export function PublicationsSection() {
  return (
    <Section meta={sectionByRoute("/publications")!}>
      <PublicationsContent />
    </Section>
  );
}

export function PublicationsPage() {
  usePageMeta("Publications");
  return (
    <PageShell meta={sectionByRoute("/publications")!}>
      <PublicationsContent />
    </PageShell>
  );
}
