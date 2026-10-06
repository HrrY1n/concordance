import { useRef, type RefObject } from "react";
import { chapters } from "../content/chapters";
import { site } from "../content/site";
import { searchIndexSize } from "../lib/search";
import { useDialog } from "../hooks/useDialog";

interface IndexOverlayProps {
  open: boolean;
  onClose: () => void;
  current: string;
  returnFocusRef: RefObject<HTMLElement | null>;
}

/**
 * Mobile index — the monograph's table of contents, full-screen, one page.
 * No stagger, a 200ms fade via CSS (budget discipline), Esc to close.
 */
export function IndexOverlay({ open, onClose, current, returnFocusRef }: IndexOverlayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useDialog({
    open,
    onClose,
    containerRef,
    initialFocusRef: closeRef,
    returnFocusRef,
  });

  if (!open) return null;

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label="Table of contents"
      className="fixed inset-0 z-50 flex animate-[overlay-in_200ms_ease-out] flex-col bg-bg"
    >
      <div className="flex h-16 items-center justify-between px-6">
        <span className="t-label flex items-center gap-2.5 text-ink-1">
          <span aria-hidden="true" className="h-2 w-2 bg-accent" />
          {site.wordmark}
        </span>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="t-mono-sm min-h-[44px] px-2 uppercase text-ink-3 transition-colors duration-150 hover:text-ink-1"
        >
          Close
        </button>
      </div>

      <nav aria-label="Chapters" className="flex-1 overflow-y-auto px-6">
        <ul className="divide-y divide-line-1 border-y border-line-1">
          {chapters.map((c) => (
            <li key={c.id}>
              <a
                href={`#${c.id}`}
                onClick={onClose}
                aria-current={c.id === current ? "location" : undefined}
                className="flex min-h-[56px] items-baseline gap-5 py-3"
              >
                <span className="t-mono text-ink-4">{c.no}</span>
                <span className="text-[26px] font-medium leading-tight tracking-[-0.02em] text-ink-1">
                  {c.title}
                </span>
                {c.id === current && (
                  <span className="t-mono-sm ml-auto uppercase text-accent-ink">Here</span>
                )}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="t-mono-sm flex items-center justify-between px-6 pb-8 pt-6 text-ink-3">
        <span>EDITION {__BUILD_DATE__}</span>
        <span>{searchIndexSize} ENTRIES · LOCAL</span>
      </div>
    </div>
  );
}
