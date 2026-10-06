import { Link, useParams } from "react-router-dom";
import { noteById, notes } from "@/content/notes";
import { researchQuestions } from "@/content/research";
import type { NoteBlock } from "@/content/types";
import { useDocumentMeta } from "@/lib/seo";
import { SidenoteRow } from "@/components/Sidenote";
import NotFoundPage from "@/pages/NotFoundPage";

/**
 * /notes/:slug — the essay register at full strength: serif, 66ch measure,
 * numbered sidenotes (grid-anchored, D1-safe), code blocks on token colors.
 * Unknown slugs render the 404 page inline.
 *
 * The "in the ledger" links are DERIVED from researchQuestions.relatedNotes
 * (P1-17) — a note with no feeding question renders no ledger link, instead
 * of every note claiming Q1.
 */

function renderBlock(block: NoteBlock, key: number) {
  switch (block.type) {
    case "h":
      return <h2 key={key}>{block.text}</h2>;
    case "p":
      return block.sidenote ? (
        <SidenoteRow key={key} note={block.sidenote}>
          {block.text}
        </SidenoteRow>
      ) : (
        <p key={key}>{block.text}</p>
      );
    case "code":
      return (
        // spacing comes from the .essay figure rule — no ad-hoc margin here
        <figure key={key}>
          {block.caption ? (
            <figcaption className="t-meta text-ink-2 mb-2">{block.caption}</figcaption>
          ) : null}
          <pre className="codeblock" data-lang={block.lang}>
            <code>{block.text}</code>
          </pre>
        </figure>
      );
  }
}

export default function NotePage() {
  const { slug } = useParams();
  const note = slug ? noteById(slug) : undefined;

  useDocumentMeta(
    note ? note.title : "Note not found",
    note ? note.summary : "No note at this address.",
  );

  if (!note) return <NotFoundPage kind="note" />;

  const related = notes.filter((n) => n.id !== note.id).slice(0, 2);
  // derived: which ledger questions does this note feed?
  const feeding = researchQuestions.filter((q) => q.relatedNotes?.includes(note.id));

  return (
    <article className="wrap pb-20 pt-14 md:pt-20">
      <header className="u-measure">
        <p className="t-meta text-ink-2">
          §04 · {note.date} · {note.kind}
        </p>
        <h1 className="t-h1 mt-4">{note.title}</h1>
        <p className="t-lede text-ink-2 mt-5">{note.summary}</p>
      </header>

      <div className="essay u-note-spread mt-12">
        {note.body?.map((block, i) => renderBlock(block, i))}
      </div>

      <footer className="u-measure mt-14 border-t border-line pt-6">
        <p className="t-meta text-ink-2 max-w-[58ch]">
          A note, not a publication: working text, kept honest by revisions rather than secrecy.
          The questions it feeds live in the ledger.
        </p>
        <div className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
          {feeding.map((q) => (
            <Link key={q.id} to={`/research#${q.id}`} className="u-link t-small inline-flex min-h-[44px] items-center">
              {q.id.toUpperCase()} in the ledger →
            </Link>
          ))}
          {related.map((r) => (
            <Link
              key={r.id}
              to={`/notes/${r.id}`}
              className="u-link t-small inline-flex min-h-[44px] items-center"
            >
              Next: {r.title.length > 34 ? `${r.title.slice(0, 34)}…` : r.title} →
            </Link>
          ))}
          <Link to="/notes" className="u-link t-small inline-flex min-h-[44px] items-center">
            All notes →
          </Link>
        </div>
      </footer>
    </article>
  );
}
