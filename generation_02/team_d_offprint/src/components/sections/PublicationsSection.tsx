import { publications } from "../../content/publications";
import { Reveal, SectionHead } from "../../components/chrome";

/** Empty state = honest reading + ghost specimen rows (C's ghost-slot
 * grammar, D's academic etiquette). The specimens double as a layout
 * contract: the first real entry replaces them with zero layout change. */
export function PublicationsSection() {
  const count = publications.length;

  return (
    <section id="publications" className="section scroll-mt-14">
      <div className="shell">
        <Reveal>
          <SectionHead
            num="03"
            kicker="Publications"
            title="Written work will appear here as it exists."
            lede="Not before. Unwritten papers are not announced, and “in preparation” is a claim this page does not make."
          />
        </Reveal>

        <div className="mt-12">
          <p className="type-mono">
            {count} PUBLICATION{count === 1 ? "" : "S"} — COUNTED, NOT PROJECTED
          </p>

          {count === 0 ? (
            <div className="mt-6" aria-hidden="true">
              {[0, 1].map((n) => (
                <div key={n} className="ghost-row flex items-baseline justify-between gap-4 py-4">
                  <span>[ AUTHORS ] — [ TITLE ] · [ VENUE ] · [ YEAR ]</span>
                  <span className="hidden sm:inline">PDF · CODE · DOI</span>
                </div>
              ))}
            </div>
          ) : (
            <ul className="mt-6">
              {publications.map((pub) => (
                <li key={pub.id} className="border-t border-divider py-6">
                  <p className="type-h3 text-ink-strong">{pub.title}</p>
                  <p className="type-mono mt-2">
                    {pub.authors.join(", ")} · {pub.venue} · {pub.year}
                  </p>
                  <p className="type-mono mt-1">
                    {[
                      pub.links.pdf && "PDF",
                      pub.links.code && "CODE",
                      pub.links.doi && "DOI",
                    ]
                      .filter(Boolean)
                      .join(" · ") || "NO LINKS YET"}
                  </p>
                </li>
              ))}
            </ul>
          )}

          <p className="type-note mt-4 max-w-[52ch]">
            The dashed rows are the reserved shape of a future entry — when the first
            paper lands, it takes their place and the layout does not move.
          </p>
        </div>
      </div>
    </section>
  );
}
