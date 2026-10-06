import { Link } from "react-router-dom";
import { notes } from "@/content/notes";
import { useDocumentMeta } from "@/lib/seo";
import { PageShell, XRef } from "@/components/structure";
import { sectionByRoute } from "@/lib/sections";
import { useMemo } from "react";

/** FIG.N1 — entry length in words, computed from the bodies themselves. */
function EntryLengthFigure() {
  const wordCounts = useMemo(
    () =>
      notes
        .map((n) => ({
          id: n.id,
          title: n.title,
          words:
            n.summary
              .split(/\s+/)
              .length +
            (n.body ?? []).reduce(
              (sum, b) => sum + ("text" in b ? b.text.split(/\s+/).length : 0),
              0,
            ),
        }))
        .sort((a, b) => b.words - a.words),
    [],
  );
  const max = Math.max(...wordCounts.map((w) => w.words), 1);
  return (
    <figure className="border-y border-line py-4" aria-label="FIG. N1 — entry length, words">
      <figcaption className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <span className="t-meta t-caps text-ink">FIG. N1 — entry length, words</span>
        <span className="t-meta text-ink-2">computed from notes.ts · 0ms network</span>
      </figcaption>
      <ul className="mt-4 max-w-[620px] space-y-2.5">
        {wordCounts.map((w) => (
          <li key={w.id} className="flex items-baseline gap-3">
            <span className="t-meta text-ink-2 w-8 shrink-0">{w.id}</span>
            <span className="t-small text-ink-2 min-w-0 flex-1 truncate">{w.title}</span>
            <span className="rank-track max-w-[220px] self-center" aria-hidden="true">
              <span className="rank-fill" style={{ transform: `scaleX(${Math.max(w.words / max, 0.02)})` }} />
            </span>
            <span className="t-meta text-ink-2 w-10 shrink-0 text-right tabular-nums">{w.words}</span>
          </li>
        ))}
      </ul>
    </figure>
  );
}

/**
 * §04 NOTES — the list page. Essay register: serif entries, real dates,
 * one figure computed from the bodies.
 */
export default function NotesPage() {
  useDocumentMeta(
    "Notes",
    "Working notes: paper readings, robustness arguments, and engineering notes from building small retrieval pipelines. All entries are sample data awaiting replacement.",
  );
  const meta = sectionByRoute("/notes")!;
  const sorted = [...notes].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <PageShell
      meta={meta}
      register="essay"
      lede="Notes are written to be read in place — serif, measured, margin apparatus included. They are where the ledger's questions go to think."
    >
      <EntryLengthFigure />
      <ul className="u-measure mt-12">
        {sorted.map((n) => (
          <li key={n.id} className="border-b border-line py-6 last:border-b-0">
            <p className="t-meta text-ink-2">
              {n.date} · {n.kind}
              {n.sample ? " · sample entry" : ""}
            </p>
            <h2 className="t-h4 mt-2">
              <Link to={`/notes/${n.id}`} className="u-link">
                {n.title}
              </Link>
            </h2>
            <p className="t-small text-ink-2 mt-2">{n.summary}</p>
            {n.body ? (
              <div className="mt-3">
                <XRef to={`/notes/${n.id}`}>Read the note</XRef>
              </div>
            ) : null}
          </li>
        ))}
      </ul>
    </PageShell>
  );
}
