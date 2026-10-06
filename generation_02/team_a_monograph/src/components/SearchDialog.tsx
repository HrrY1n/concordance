import { useEffect, useMemo, useRef, useState } from "react";
import { navChapters } from "../content/chapters";
import { searchEntries, searchIndex, type SearchEntry } from "../lib/search";
import { tokenize } from "../lib/retrieval";
import { useDialog } from "../hooks/useDialog";

interface SearchDialogProps {
  open: boolean;
  onClose: () => void;
  navigate: (target: string) => void;
  returnFocusRef: React.RefObject<HTMLElement | null>;
}

function Highlighted({ text, terms }: { text: string; terms: string[] }) {
  if (terms.length === 0) return <>{text}</>;
  const lower = text.toLowerCase();
  let at = -1;
  let len = 0;
  for (const term of terms) {
    const i = lower.indexOf(term);
    if (i !== -1 && (at === -1 || i < at)) {
      at = i;
      len = term.length;
    }
  }
  if (at === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, at)}
      <mark>{text.slice(at, at + len)}</mark>
      {text.slice(at + len)}
    </>
  );
}

/**
 * Site search (stolen from E, re-spoken in the monograph's language):
 * pure front-end, index built from the same typed content arrays that render
 * the page, honest readouts in the footer. `/` opens it.
 */
export function SearchDialog({ open, onClose, navigate, returnFocusRef }: SearchDialogProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const terms = useMemo(() => tokenize(query), [query]);
  // Empty query = the index itself: jump to any chapter.
  const visible: SearchEntry[] = useMemo(
    () =>
      terms.length > 0
        ? searchEntries(query, 8)
        : navChapters.map(
            (c) => searchIndex.find((e) => e.id === `chapter-${c.id}`)!,
          ),
    [query, terms.length],
  );

  useDialog({ open, onClose, containerRef, initialFocusRef: inputRef, returnFocusRef });

  useEffect(() => {
    setActive(0);
  }, [query]);

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  useEffect(() => {
    const el = listRef.current?.children[active];
    if (el instanceof HTMLElement) el.scrollIntoView({ block: "nearest" });
  }, [active]);

  if (!open) return null;

  const go = (entry: SearchEntry) => {
    navigate(entry.target);
    onClose();
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((i) => Math.min(i + 1, visible.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const entry = visible[active];
      if (entry) go(entry);
    }
  };

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Search this monograph">
      <div
        role="presentation"
        onClick={onClose}
        className="absolute inset-0 bg-[color-mix(in_srgb,var(--color-bg)_88%,transparent)]"
      />
      <div
        ref={containerRef}
        onKeyDown={onKeyDown}
        className="relative mx-auto mt-[9vh] w-[calc(100vw-32px)] max-w-[640px] border border-line-2 bg-bg"
      >
        <div className="flex items-center gap-3 border-b border-line-1 px-5">
          <span aria-hidden="true" className="t-mono-sm uppercase text-ink-4">
            Q
          </span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Query this monograph…"
            aria-label="Search this monograph"
            className="t-body w-full bg-transparent py-4 caret-accent outline-none placeholder:text-ink-4"
          />
          <kbd aria-hidden="true" className="t-mono-sm border border-line-1 px-1.5 py-0.5 text-ink-4">
            ESC
          </kbd>
        </div>

        <ul ref={listRef} role="listbox" aria-label="Results" className="max-h-[46vh] overflow-y-auto">
          {visible.length === 0 && (
            <li className="t-body px-5 py-4 text-ink-3">
              0 RESULTS — nothing in this monograph matches “{query}”.
            </li>
          )}
          {visible.map((entry, i) => (
            <li
              key={entry.id}
              role="option"
              aria-selected={i === active}
              className="border-b border-line-1 last:border-b-0"
            >
              <button
                type="button"
                onClick={() => go(entry)}
                onMouseEnter={() => setActive(i)}
                className={
                  "grid w-full grid-cols-[5rem_1fr] items-baseline gap-4 px-5 py-3 text-left " +
                  (i === active
                    ? "bg-[color-mix(in_srgb,var(--color-wash)_45%,transparent)] shadow-[inset_2px_0_0_0_var(--color-accent)]"
                    : "")
                }
              >
                <span className="t-mono-sm uppercase text-ink-4">{entry.label}</span>
                <span className="min-w-0">
                  <span className="t-body block text-ink-1">
                    <Highlighted text={entry.title} terms={terms} />
                  </span>
                  {entry.text && (
                    <span className="t-body-sm mt-0.5 block truncate text-ink-3">{entry.text}</span>
                  )}
                </span>
              </button>
            </li>
          ))}
        </ul>

        <div className="t-mono-sm flex items-center justify-between gap-4 border-t border-line-1 px-5 py-2.5 text-ink-3">
          <span>
            {terms.length > 0
              ? `${visible.length} RESULTS`
              : `${searchIndex.length} ENTRIES · INDEX`}
          </span>
          <span aria-hidden="true">LEXICAL · LOCAL · 0MS NETWORK</span>
        </div>
      </div>
    </div>
  );
}
