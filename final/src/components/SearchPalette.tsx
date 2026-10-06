import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  buildIndex,
  buildPassages,
  indexSize,
  kwicWindow,
  queryPassages,
  queryRecords,
  selectResults,
} from "@/lib/search";
import { lockScroll, setOverlayOpen, trapTab } from "@/lib/focus";
import { paletteSuggestions } from "@/content/lab";
import { site } from "@/content/site";

/**
 * The concordance proper — the site's active retrieval surface. Full combobox
 * semantics: input[role=combo] + listbox + aria-activedescendant (§4 / H3).
 * Opened from the header, from the keyboard (/ or ⌘K), from ?q= deep links,
 * and from any facet/tag that calls openSearch(term) (§4 / M3).
 *
 * Two result genotypes (P2-20): catalog rows (type · title · coord) and KWIC
 * quotation rows — the matched sentence with the term in <mark>, cited by
 * coordinate and date. This is what makes the palette a concordance instead
 * of a menu.
 */
export function SearchPalette({
  open,
  onClose,
  initialQuery,
  onToggleTheme,
}: {
  open: boolean;
  onClose: () => void;
  initialQuery?: string;
  onToggleTheme: () => void;
}) {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const records = useMemo(() => buildIndex(), []);
  const passages = useMemo(() => buildPassages(), []);
  const selection = useMemo(() => selectResults(queryRecords(records, query)), [records, query]);
  const quotes = useMemo(() => queryPassages(passages, query), [passages, query]);
  const optionCount = selection.shown.length + quotes.length;

  // Open/close transitions and new pre-queries are derived state changes made
  // during render (react-hooks guidance) — no cascading effect.
  const [openState, setOpenState] = useState(() => ({ open, initialQuery }));
  if (openState.open !== open || openState.initialQuery !== initialQuery) {
    setOpenState({ open, initialQuery });
    if (open) {
      // Priority: programmatic query (facet clicks) > ?q= deep link > empty.
      let initial = initialQuery ?? "";
      if (initial === "") {
        try {
          initial = new URLSearchParams(window.location.search).get("q") ?? "";
        } catch {
          initial = "";
        }
      }
      setQuery(initial);
      setActiveIdx(0);
    }
  }

  const [activeQuery, setActiveQuery] = useState(query);
  if (activeQuery !== query) {
    setActiveQuery(query);
    setActiveIdx(0);
  }

  // External-system side effects of being open: focus, scroll lock, Esc.
  useEffect(() => {
    if (!open) return;
    setOverlayOpen(true);
    lockScroll(true);
    const timer = window.setTimeout(() => inputRef.current?.focus(), 20);
    return () => {
      window.clearTimeout(timer);
      lockScroll(false);
      setOverlayOpen(false);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const execute = (index: number) => {
    if (index < selection.shown.length) {
      const record = selection.shown[index];
      if (!record) return;
      if (record.action === "theme") {
        onToggleTheme();
        onClose();
        return;
      }
      if (record.action === "top") {
        onClose();
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      onClose();
      navigate(record.route);
      return;
    }
    const quote = quotes[index - selection.shown.length];
    if (!quote) return;
    onClose();
    navigate(quote.route);
  };

  const onInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIdx((i) => (optionCount === 0 ? 0 : (i + 1) % optionCount));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIdx((i) => (optionCount === 0 ? 0 : (i - 1 + optionCount) % optionCount));
    } else if (event.key === "Enter") {
      event.preventDefault();
      execute(activeIdx);
    }
  };

  return (
    /* Backdrop click-to-dismiss is a standard modal idiom — the heuristic
       below (no-static-element-interactions) is intentionally satisfied by
       the adjacent dialog role instead. */
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className="fixed inset-0 z-[var(--z-overlay)] overflow-y-auto p-4 pt-[calc(1rem+env(safe-area-inset-top))] sm:p-6"
      style={{ background: "color-mix(in oklab, var(--ink) 32%, transparent)" }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="u-figure mx-auto mt-[8vh] w-full">
        {/* Tab trapping on the dialog container is the standard focus-trap
            idiom for non-trivial modals. */}
        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={site.searchLabel}
          className="border border-line-strong bg-raised shadow-[0_24px_80px_-24px_var(--shadow)]"
          onKeyDown={(event) => trapTab(event.nativeEvent, dialogRef.current)}
        >
          <div className="border-b border-line">
            <input
              ref={inputRef}
              type="text"
              role="combobox"
              aria-expanded="true"
              aria-controls="palette-list"
              aria-activedescendant={activeIdx < optionCount ? `palette-opt-${activeIdx}` : undefined}
              aria-label={site.searchLabel}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={onInputKeyDown}
              placeholder={site.searchPlaceholder}
              enterKeyHint="search"
              className="t-code w-full bg-transparent px-5 py-4 text-ink outline-none placeholder:text-ink-2"
            />
          </div>

          {/* P0-9: truncation is announced, never silent. */}
          {selection.truncated ? (
            <p className="t-meta text-ink-2 border-b border-line px-5 py-2" aria-live="polite">
              showing {selection.shown.filter((r) => !r.action).length} of {selection.totalMatches}{" "}
              matches — refine the query to narrow
            </p>
          ) : null}

          <ul id="palette-list" role="listbox" aria-label="Results" className="max-h-[46vh] overflow-y-auto">
            {selection.shown.map((record, i) => (
              <li key={record.id}>
                <button
                  type="button"
                  id={`palette-opt-${i}`}
                  role="option"
                  aria-selected={i === activeIdx}
                  onMouseEnter={() => setActiveIdx(i)}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => execute(i)}
                  className={`flex min-h-[44px] w-full items-baseline gap-3 px-5 py-2.5 text-left ${
                    i === activeIdx ? "bg-inset" : ""
                  }`}
                >
                  <span className="t-meta t-caps text-ink-2 w-16 shrink-0">{record.type}</span>
                  <span className="t-small text-ink min-w-0 flex-1 truncate">{record.title}</span>
                  <span className="t-meta text-ink-2 shrink-0">{record.coord}</span>
                </button>
              </li>
            ))}
            {quotes.map((quote, qi) => {
              const i = selection.shown.length + qi;
              const kwic = kwicWindow(quote.text, quote.matchStart, quote.matchLength);
              return (
                <li key={quote.id}>
                  <button
                    type="button"
                    id={`palette-opt-${i}`}
                    role="option"
                    aria-selected={i === activeIdx}
                    onMouseEnter={() => setActiveIdx(i)}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => execute(i)}
                    className={`flex min-h-[44px] w-full items-baseline gap-3 px-5 py-2.5 text-left ${
                      i === activeIdx ? "bg-inset" : ""
                    }`}
                  >
                    <span className="t-meta t-caps text-accent w-16 shrink-0">QUOTE</span>
                    <span className="t-small min-w-0 flex-1 truncate text-ink-2">
                      {kwic.left}
                      <mark className="text-ink">{kwic.match}</mark>
                      {kwic.right}
                    </span>
                    <span className="t-meta text-ink-2 shrink-0">{quote.coord}</span>
                  </button>
                </li>
              );
            })}
            {optionCount === 0 ? (
              <li className="px-5 py-6">
                <p className="t-small text-ink-2" aria-live="polite">
                  no documents matched <span className="font-mono">“{query}”</span>
                </p>
                <p className="t-meta text-ink-2 mt-2">
                  try: {paletteSuggestions.join(" · ")}
                </p>
              </li>
            ) : null}
          </ul>

          <div className="t-meta text-ink-2 flex flex-wrap items-center justify-between gap-2 border-t border-line px-5 py-3">
            <span aria-live="polite">
              local index · {indexSize()} records · 0ms network
            </span>
            <span className="flex items-center gap-2" aria-hidden="true">
              <kbd>↑↓</kbd>
              <kbd>↵</kbd>
              <kbd>esc</kbd>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/** `?` — the help layer: keyboard discoverability. */
export function HelpOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    setOverlayOpen(true);
    lockScroll(true);
    // P0-13: the dialog takes focus when it opens (previously focus stayed
    // wherever it was, so keyboard users kept typing into the page below).
    const timer = window.setTimeout(() => dialogRef.current?.focus(), 20);
    return () => {
      window.clearTimeout(timer);
      lockScroll(false);
      setOverlayOpen(false);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className="fixed inset-0 z-[var(--z-overlay)] overflow-y-auto p-4 pt-[calc(1rem+env(safe-area-inset-top))] sm:p-6"
      style={{ background: "color-mix(in oklab, var(--ink) 32%, transparent)" }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="mx-auto mt-[14vh] w-full max-w-[540px]">
        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label="Keyboard help"
          tabIndex={-1}
          className="border border-line-strong bg-raised p-6 outline-none md:p-8"
          onKeyDown={(event) => trapTab(event.nativeEvent, dialogRef.current)}
        >
          <h2 className="t-entry">Keyboard</h2>
          <dl className="mt-5 space-y-3">
            {[
              ["/ or ⌘K", "Query this site"],
              ["?", "This help"],
              ["esc", "Close any layer"],
              ["tab", "Move focus — everything is reachable"],
            ].map(([key, what]) => (
              <div key={key} className="flex items-baseline justify-between gap-4">
                <dt>
                  <kbd>{key}</kbd>
                </dt>
                <dd className="t-small text-ink-2 text-right">{what}</dd>
              </div>
            ))}
          </dl>
          <h2 className="t-entry mt-8">Addresses</h2>
          <p className="t-small text-ink-2 mt-3">
            Every section has a coordinate (§01–§07); the palette cites them. The theme button
            cycles system → light → dark and remembers your choice.
          </p>
          <div className="mt-6 flex justify-end">
            <button type="button" onClick={onClose} className="u-link t-small inline-flex min-h-[44px] items-center">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
