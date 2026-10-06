import { publications } from "@/content/publications";
import { site } from "@/content/site";
import { useDocumentMeta } from "@/lib/seo";
import { PageShell } from "@/components/structure";
import { sectionByRoute } from "@/lib/sections";

/**
 * §05 PUBLICATIONS — the page renders exactly what publications.ts contains
 * (P1-15). Zero records: the empty state is a first-class page. One record or
 * forty: numbered rows with venue/year and only the links that exist, plus a
 * ghost row whose number is DERIVED — the "auto-numbers when the list grows"
 * promise is now implemented, not rhetorical.
 */

const pad2 = (n: number) => String(n).padStart(2, "0");

export default function PublicationsPage() {
  useDocumentMeta(
    "Publications",
    "Peer-reviewed work. The list and its evidence chains appear here as the work exists — nothing staged, nothing promised.",
  );
  const meta = sectionByRoute("/publications")!;

  return (
    <PageShell meta={meta} lede="A list of papers, not a list of promises. This page renders exactly what the publications data contains.">
      <p className="t-meta t-caps text-ink-2">records: {publications.length}</p>

      {publications.length === 0 ? (
        <>
          <h2 className="t-h3 mt-6 max-w-[40ch]">{site.publicationsEmptyTitle}</h2>
          <p className="t-body text-ink-2 mt-4 max-w-[58ch]">{site.publicationsEmptyBody}</p>
        </>
      ) : null}

      <ol className="mt-12">
        {publications.map((pub, i) => (
          <li key={pub.id} className="grid gap-x-6 gap-y-1 border-t border-line py-5 md:grid-cols-[4rem_1fr]">
            <span className="t-meta text-accent" aria-hidden="true">
              [{pad2(i + 1)}]
            </span>
            <div>
              <h3 className="t-h4 max-w-[46ch]">{pub.title}</h3>
              <p className="t-meta text-ink-2 mt-2">
                {pub.authors.join(" · ")} — {pub.venue}, {pub.year}
              </p>
              {pub.links.pdf || pub.links.code || pub.links.doi ? (
                <p className="t-small mt-2 flex flex-wrap gap-x-6 gap-y-2">
                  {pub.links.pdf ? (
                    <a href={pub.links.pdf} className="u-link inline-flex min-h-[44px] items-center">
                      pdf <span aria-hidden="true">↗</span>
                    </a>
                  ) : null}
                  {pub.links.code ? (
                    <a href={pub.links.code} className="u-link inline-flex min-h-[44px] items-center">
                      code <span aria-hidden="true">↗</span>
                    </a>
                  ) : null}
                  {pub.links.doi ? (
                    <a href={pub.links.doi} className="u-link inline-flex min-h-[44px] items-center">
                      doi <span aria-hidden="true">↗</span>
                    </a>
                  ) : null}
                </p>
              ) : null}
            </div>
          </li>
        ))}

        {/* the ghost row — numbering derived from the data, zero staged content.
            ink-2, not faint: this row carries information (P0-11). */}
        <li className="flex items-baseline gap-4 border-t border-dashed border-line-strong py-4 text-ink-2">
          <span className="t-meta" aria-hidden="true">
            [{pad2(publications.length + 1)}]
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
