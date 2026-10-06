import { notes } from "../../content/writing";
import { Reveal, SectionHead } from "../../components/chrome";

const KIND_LABEL: Record<string, string> = {
  note: "Note",
  "paper-reading": "Paper reading",
  engineering: "Engineering",
};

function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${y}.${m}.${d}`;
}

export function NotesSection() {
  return (
    <section id="notes" className="section scroll-mt-14">
      <div className="shell">
        <Reveal>
          <SectionHead
            num="05"
            kicker="Notes"
            title="The draft layer."
            lede="Thinking in public before it becomes a claim. Three notes, newest first."
          />
        </Reveal>

        <ul className="mt-12">
          {notes.map((note, i) => (
            <Reveal key={note.id} delay={Math.min(i * 0.05, 0.15)}>
              <li className="row-hover grid gap-2 border-t border-divider py-7 lg:grid-cols-[minmax(0,60ch)_minmax(0,21ch)] lg:gap-x-16">
                <div className="pl-4 lg:pl-5">
                  <p className="type-mono">
                    {formatDate(note.date)} · {note.kind.toUpperCase()}
                  </p>
                  <h3 className="type-h3 mt-1 max-w-[48ch] text-ink-strong">
                    {note.title}
                  </h3>
                  <p className="type-body mt-2 max-w-[56ch] text-ink-2">{note.summary}</p>
                </div>
                <div className="hidden lg:flex lg:items-start lg:justify-end lg:pt-1">
                  <span className="chip">{KIND_LABEL[note.kind] ?? note.kind}</span>
                </div>
              </li>
            </Reveal>
          ))}
        </ul>
        <p className="type-mono border-t border-divider pt-3">
          {notes.length} NOTES — FULL TEXTS SHIP WHEN THE ARGUMENTS SURVIVE READING THEM
          A WEEK LATER
        </p>
      </div>
    </section>
  );
}
