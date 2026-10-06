import { publications } from "@/content/publications";
import { site } from "@/content/site";
import { useDocumentMeta } from "@/lib/seo";
import { PageShell } from "@/components/structure";
import { sectionByRoute } from "@/lib/sections";

/**
 * §05 PUBLICATIONS — the empty state as a first-class page. Academic
 * etiquette: nothing in review, nothing staged, one ghost row that
 * auto-numbers the day publications.ts grows.
 */
export default function PublicationsPage() {
  useDocumentMeta(
    "Publications",
    "Peer-reviewed work. Currently zero records — nothing in review, nothing staged. The list and its evidence chains appear here when the work exists.",
  );
  const meta = sectionByRoute("/publications")!;

  return (
    <PageShell meta={meta} lede="A list of papers, not a list of promises. This page renders exactly what publications.ts contains — right now, nothing.">
      <p className="t-meta t-caps text-ink-2">records: {publications.length}</p>

      <h2 className="t-h3 mt-6 max-w-[40ch]">{site.publicationsEmptyTitle}</h2>
      <p className="t-body text-ink-2 mt-4 max-w-[58ch]">{site.publicationsEmptyBody}</p>

      {/* the ghost row — reserved numbering, zero staged content */}
      <ol className="mt-12">
        <li className="flex items-baseline gap-4 border-t border-dashed border-line-strong py-4 text-faint">
          <span className="t-meta" aria-hidden="true">
            [01]
          </span>
          <span className="t-meta t-caps">{site.publicationsReserved}</span>
        </li>
      </ol>

      <div className="t-meta text-ink-2 mt-10 border-t border-line pt-4">
        <p>
          what belongs here when it exists: peer-reviewed papers, preprints with DOIs, datasets
          and benchmarks with persistent identifiers — each with its evidence chain and the ledger
          question it answers.
        </p>
      </div>
    </PageShell>
  );
}
