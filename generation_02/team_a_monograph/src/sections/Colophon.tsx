import { site } from "../content/site";
import { notes } from "../content/notes";
import { projects } from "../content/projects";
import { publications } from "../content/publications";
import { researchQuestions } from "../content/research";

/**
 * Colophon — the bookmaker's back page. Every readout is computed from the
 * content modules or injected at build time; nothing is hand-written.
 */
export function Colophon() {
  const records =
    `WORK ${projects.length} · NOTES ${notes.length} · PUBS ${publications.length} · QUESTIONS ${researchQuestions.length}`;
  return (
    <footer className="border-t border-line-1">
      <div className="mx-auto grid max-w-[1216px] grid-cols-1 gap-x-8 gap-y-10 px-6 py-16 md:px-12 lg:grid-cols-12 xl:px-20">
        <div className="lg:col-span-7">
          <p className="t-label flex items-center gap-2.5 text-ink-1">
            <span aria-hidden="true" className="h-2 w-2 bg-accent" />
            {site.wordmark}
          </p>
          <p className="t-body-sm mt-4 max-w-[52ch] text-ink-3">
            {site.colophonLegend}
          </p>
        </div>
        <dl className="t-mono-sm space-y-2.5 text-ink-3 lg:col-span-5">
          <div className="flex justify-between gap-6">
            <dt className="uppercase text-ink-4">Edition</dt>
            <dd className="text-right">{__BUILD_DATE__}</dd>
          </div>
          <div className="flex justify-between gap-6">
            <dt className="uppercase text-ink-4">Records</dt>
            <dd className="text-right">{records}</dd>
          </div>
          <div className="flex justify-between gap-6">
            <dt className="uppercase text-ink-4">Type</dt>
            <dd className="text-right">INTER · NEWSREADER · IBM PLEX MONO</dd>
          </div>
          <div className="flex justify-between gap-6">
            <dt className="uppercase text-ink-4">Method</dt>
            <dd className="text-right">REACT + VITE · 0 TRACKERS · 0MS NETWORK</dd>
          </div>
        </dl>
      </div>
    </footer>
  );
}
