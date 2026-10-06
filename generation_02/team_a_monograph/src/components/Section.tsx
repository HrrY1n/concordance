import type { ReactNode } from "react";
import type { Chapter } from "../content/types";

interface SectionProps {
  chapter: Chapter;
  children: ReactNode;
  /**
   * Wide sections (Selected Work) run the full measure through col 12 —
   * the monograph's one fold-out plate. Everything else keeps col 11–12
   * empty as the site's breathing margin.
   */
  wide?: boolean;
}

/** Chapter skeleton: sticky book-page header column + content column. */
export function Section({ chapter, children, wide = false }: SectionProps) {
  return (
    <section
      id={chapter.id}
      aria-labelledby={`${chapter.id}-heading`}
      tabIndex={-1}
      className="border-t border-line-1 py-20 lg:py-36"
    >
      <div className="mx-auto max-w-[1216px] px-6 md:px-12 xl:px-20">
        <div className="grid grid-cols-1 gap-x-8 gap-y-8 lg:grid-cols-12">
          <header className="lg:col-span-3">
            <div className="lg:sticky lg:top-28">
              <p className="t-mono text-ink-4">{chapter.no}</p>
              <h2 id={`${chapter.id}-heading`} className="t-title mt-2">
                {chapter.title}
              </h2>
              {chapter.blurb && (
                <p className="t-body-sm mt-2 max-w-[30ch] text-ink-3">{chapter.blurb}</p>
              )}
            </div>
          </header>
          <div className={wide ? "lg:col-span-9" : "lg:col-span-7"}>{children}</div>
        </div>
      </div>
    </section>
  );
}
