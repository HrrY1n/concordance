import { Section } from "../components/Section";
import { chapters } from "../content/chapters";
import { notes } from "../content/notes";
import type { Note } from "../content/types";

const KIND_LABEL: Record<Note["kind"], string> = {
  "paper-reading": "Paper reading",
  note: "Note",
  engineering: "Engineering",
};

/** §06 — notes as entries in the monograph's appendix. Read, not clicked. */
export function NotesSection() {
  const chapter = chapters.find((c) => c.id === "notes")!;
  return (
    <Section chapter={chapter}>
      <ol className="border-t border-line-1">
        {notes.map((n) => (
          <li
            key={n.id}
            id={`note-${n.id}`}
            className="grid grid-cols-1 gap-y-2 border-b border-line-1 py-6 md:grid-cols-[8rem_1fr] md:gap-x-6"
          >
            <div className="t-mono-sm uppercase text-ink-3">
              {n.date}
              <span className="mt-1 block text-ink-4">{KIND_LABEL[n.kind]}</span>
            </div>
            <div>
              <h3 className="max-w-[46ch] text-[19px] font-medium leading-snug tracking-[-0.01em] text-ink-1">
                {n.title}
              </h3>
              <p className="t-body-sm mt-2 max-w-[62ch] text-ink-3">{n.summary}</p>
            </div>
          </li>
        ))}
      </ol>
      <p className="t-mono-sm mt-8 text-ink-4">
        FULL TEXTS FOLLOW THE NOTES, NOT BEFORE — {notes.length} ENTRIES IN THIS EDITION.
      </p>
    </Section>
  );
}
