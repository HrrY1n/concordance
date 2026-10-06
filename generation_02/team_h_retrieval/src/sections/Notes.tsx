import { notes } from "@/content/publications";
import { sectionByRoute } from "@/lib/sections";
import { usePageMeta } from "@/lib/seo";
import { PageShell, Section } from "@/components/structure";

const kindLabel: Record<(typeof notes)[number]["kind"], string> = {
  "paper-reading": "paper reading",
  note: "note",
  engineering: "engineering",
};

/** Three rows, no fake depth: notes are summaries until real ones exist. */
export function NotesContent() {
  return (
    <ul className="border-t border-line">
      {notes.map((note) => (
        <li key={note.id} className="grid gap-1 border-b border-line py-5 md:grid-cols-12 md:gap-6">
          <p className="t-meta text-faint pt-1 md:col-span-3">
            {note.date} · {kindLabel[note.kind]}
          </p>
          <div className="md:col-span-9">
            <h3 className="t-entry">{note.title}</h3>
            <p className="t-small text-muted mt-1 max-w-[66ch]">{note.summary}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function NotesSection() {
  return (
    <Section
      meta={sectionByRoute("/notes")!}
      lede="Working notes — the thinking process, published as it happens."
    >
      <NotesContent />
    </Section>
  );
}

export function NotesPage() {
  usePageMeta("Notes");
  return (
    <PageShell
      meta={sectionByRoute("/notes")!}
      lede="Working notes — the thinking process, published as it happens."
    >
      <NotesContent />
    </PageShell>
  );
}
