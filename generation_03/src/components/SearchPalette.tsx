import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { buildIndex, queryRecords } from "@/lib/search";
import { lockScroll, setOverlayOpen, trapTab } from "@/lib/focus";
import { paletteSuggestions } from "@/content/lab";
import { site } from "@/content/site";

/**
 * The concordance proper — the site's active retrieval surface. Full combobox
 * semantics: input[role=combo] + listbox + aria-activedescendant (§4 / H3).
 * Opened from the header, from the keyboard (/ or ⌘K), from ?q= deep links,
 * and from any facet/tag that calls openSearch(term) (§4 / M3).
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
  const results = useMemo(() => queryRecords(records, query), [records, query]);

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
    const record = results[index];
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
  };

  const onInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIdx((i) => (results.length === 0 ? 0 : (i + 1) % results.length));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIdx((i) => (results.length === 0 ? 0 : (i - 1 + results.length) % results.length));
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
      className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6"
      style={{ background: "color-mix(in oklab, var(--ink) 32%, transparent)" }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="mx-auto mt-[8vh] w-full max-w-[640px]">
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
              aria-activedescendant={results[activeIdx] ? `palette-opt-${activeIdx}` : undefined}
              aria-label={site.searchLabel}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={onInputKeyDown}
              placeholder={site.searchPlaceholder}
              className="t-code w-full bg-transparent px-5 py-4 text-ink outline-none placeholder:text-faint"
            />
          </div>

          <ul id="palette-list" role="listbox" aria-label="Results" className="max-h-[46vh] overflow-y-auto">
            {results.map((record, i) => (
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
            {results.length === 0 ? (
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
              local index · {records.length} records · 0ms network
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
    return () => {
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
      className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6"
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
          className="border border-line-strong bg-raised p-6 md:p-8"
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
            <button type="button" onClick={onClose} className="u-link t-small min-h-[44px]">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
