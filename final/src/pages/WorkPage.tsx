import { chains, projects } from "@/content/projects";
import { caseByProjectId } from "@/content/cases";
import { useDocumentMeta } from "@/lib/seo";
import { useSearch } from "@/lib/palette";
import { PageShell, XRef } from "@/components/structure";
import { sectionByRoute } from "@/lib/sections";

/**
 * §02 WORK — Selected Work as numbered plates of a concordance: full-measure
 * spreads, display-scale titles, hairline rules, and an evidence chain under
 * each title (problem → method → artifacts that exist). No cards, ever.
 * Every plate is real work with a verifiable repository (Real Content & Cases
 * pass — the sample résumé entries were removed, not rewritten).
 */

function StatusMark({ status }: { status: "active" | "maintained" | "archived" | null }) {
  if (status === null) return null;
  const tone = status === "active" ? "alive" : status === "maintained" ? "alive" : "quiet";
  return (
    <span className="t-meta t-caps inline-flex items-center gap-2 text-ink-2">
      <span className="dot" data-tone={tone} aria-hidden="true" />
      {status}
    </span>
  );
}

export default function WorkPage() {
  useDocumentMeta(
    "Selected Work",
    "Real software with its evidence attached: a local-first inventory PWA, a browser-native sound workbench, and the archive itself — every plate linked to a public repository.",
  );
  const { openSearch } = useSearch();
  const meta = sectionByRoute("/work")!;

  return (
    <PageShell
      meta={meta}
      register="plate"
      lede="Each plate is real work: an evidence chain (problem → method → artifacts that exist), a public repository, and — where written — a full case study."
    >
      <ol>
        {projects.map((p, i) => {
          const chain = chains[p.id];
          return (
            <li
              key={p.id}
              id={`plate-${p.id}`}
              className="scroll-mt-24 border-t border-line py-14 first:border-t-0 first:pt-0 lg:py-16"
            >
              <div className="grid grid-cols-1 gap-x-10 gap-y-5 lg:grid-cols-12">
                {/* plate meta column */}
                <div className="flex items-baseline gap-5 lg:col-span-3 lg:flex-col lg:items-start lg:gap-2.5 lg:pt-2">
                  <span className="t-meta t-caps text-ink-2">
                    PLATE {String(i + 1).padStart(2, "0")}
                  </span>
                  <StatusMark status={p.status} />
                  <span className="t-meta text-ink-2">{p.year}</span>
                  {/* honest readings: sample entries say so in the meta column —
                      visitors can't mistake them for a real track record (P0-4) */}
                  {p.sample ? (
                    <span className="t-meta t-caps text-ink-2">sample entry</span>
                  ) : null}
                </div>

                {/* plate body */}
                <div className="lg:col-span-9">
                  <h2 className="t-h1">{p.title}</h2>
                  <p className="t-lede text-ink-2 mt-4 max-w-[54ch]">{p.summary}</p>

                  <dl className="t-meta mt-6 grid max-w-[62ch] gap-x-8 gap-y-2 sm:grid-cols-[7rem_1fr]">
                    <dt className="t-caps text-ink-2">role</dt>
                    <dd className="text-ink-2">{p.role}</dd>
                    <dt className="t-caps text-ink-2">stack</dt>
                    <dd className="flex flex-wrap gap-2">
                      {/* u-chip, like every other retrieval entry — the third
                          ad-hoc link style is retired and the touch target is
                          a real 44px row (P0-14). */}
                      {p.tags.map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => openSearch(tag)}
                          className="u-chip !px-2.5"
                          aria-label={`Search the site for “${tag}”`}
                        >
                          {tag} <span aria-hidden="true">⌕</span>
                        </button>
                      ))}
                    </dd>
                    <dt className="t-caps text-ink-2">links</dt>
                    <dd className="text-ink-2">
                      {p.links.github || p.links.demo || p.links.writeup ? (
                        <span className="flex flex-wrap gap-x-4">
                          {p.links.github ? <a className="u-link" href={p.links.github}>repo ↗</a> : null}
                          {p.links.demo ? <a className="u-link" href={p.links.demo}>demo ↗</a> : null}
                          {p.links.writeup ? <a className="u-link" href={p.links.writeup}>writeup ↗</a> : null}
                        </span>
                      ) : (
                        <span>unlisted until they exist</span>
                      )}
                    </dd>
                    <dt className="t-caps text-ink-2">case study</dt>
                    <dd>
                      {(() => {
                        const cs = caseByProjectId(p.id);
                        if (cs) {
                          return <XRef to={`/work/${cs.slug}`}>Read the case study</XRef>;
                        }
                        if (p.id === "this-site") {
                          return <XRef to="/">you are standing in it</XRef>;
                        }
                        return <span className="text-ink-2">none yet</span>;
                      })()}
                    </dd>
                  </dl>

                  {/* evidence chain */}
                  <div className="mt-8 border-l-2 border-line pl-5">
                    <p className="t-meta t-caps text-ink-2">evidence chain</p>
                    <p className="t-small text-ink mt-2 max-w-[56ch]">{chain.problem}</p>
                    <ul className="t-code text-ink-2 mt-3 space-y-1">
                      {chain.method.map((m) => (
                        <li key={m}>· {m}</li>
                      ))}
                    </ul>
                    <ul className="t-meta text-ink-2 mt-3 space-y-1">
                      {chain.artifacts.map((a) => (
                        <li key={a}>— {a}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </PageShell>
  );
}
