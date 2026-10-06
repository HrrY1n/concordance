import type { ReactNode } from "react";
import { useMediaQuery } from "@/lib/focus";
import type { Sidenote as SidenoteData } from "@/content/types";

/**
 * Sidenote — the essay's marginal apparatus (§4 / D1).
 * Positioning is GRID-based: the note occupies its own column beside the
 * measure, so it can never escape or overlap the text (D's negative-margin
 * escape is structurally impossible here). Three stages:
 *   ≥68rem  grid row [measure | margin]
 *   ≥48rem  inline aside with an accent bar
 *   <48rem  native <details> fold, numbered summary, no JS animation
 */
export function SidenoteRow({
  note,
  children,
}: {
  note: SidenoteData;
  children: ReactNode;
}) {
  const isFloat = useMediaQuery("(min-width: 68rem)");
  const isInline = useMediaQuery("(min-width: 48rem)");

  const anchor = (
    <p className="relative">
      {children}
      <span className="sn-num" aria-hidden="true">
        [{note.n}]
      </span>
    </p>
  );

  const body = (
    <>
      <span className="t-meta text-accent mr-1" aria-hidden="true">
        {note.n}
      </span>
      {note.text}
    </>
  );

  if (isFloat) {
    return (
      <div className="sn-row">
        {anchor}
        <aside className="t-small text-ink-2 pt-1" aria-label={`Margin note ${note.n}`}>
          {body}
        </aside>
      </div>
    );
  }

  if (isInline) {
    return (
      <div>
        {anchor}
        <aside
          className="t-small text-ink-2 mt-3 border-l-2 border-accent bg-inset px-4 py-3"
          aria-label={`Margin note ${note.n}`}
        >
          {body}
        </aside>
      </div>
    );
  }

  return (
    <div>
      {anchor}
      <details className="sn-fold mt-2">
        <summary className="t-meta text-accent inline-flex min-h-[44px] cursor-pointer items-center list-none">
          <span aria-hidden="true">margin note {note.n} ▾</span>
        </summary>
        <div className="t-small text-ink-2 mt-1 border-l-2 border-accent px-4 py-2 pb-2">
          {body}
        </div>
      </details>
    </div>
  );
}
