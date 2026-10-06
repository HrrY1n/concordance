import { useEffect, useState, type RefObject } from "react";
import { navChapters } from "../content/chapters";
import { site } from "../content/site";
import type { ThemeMode } from "../hooks/useTheme";

interface HeaderProps {
  current: string;
  mode: ThemeMode;
  onCycleTheme: () => void;
  onOpenSearch: () => void;
  onOpenIndex: () => void;
  searchOpenerRef: RefObject<HTMLButtonElement | null>;
  indexOpenerRef: RefObject<HTMLButtonElement | null>;
}

const NEXT_MODE: Record<ThemeMode, ThemeMode> = {
  auto: "light",
  light: "dark",
  dark: "auto",
};

/** Fixed running head: wordmark, chapter toc, search, theme, index. */
export function Header({
  current,
  mode,
  onCycleTheme,
  onOpenSearch,
  onOpenIndex,
  searchOpenerRef,
  indexOpenerRef,
}: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const currentChapter = navChapters.find((c) => c.id === current);

  return (
    <header
      className={
        "fixed inset-x-0 top-0 z-40 transition-colors duration-200 " +
        (scrolled
          ? "border-b border-line-1 bg-[color-mix(in_srgb,var(--color-bg)_92%,transparent)] backdrop-blur-[12px]"
          : "border-b border-transparent")
      }
    >
      <div className="mx-auto flex h-16 max-w-[1216px] items-center justify-between gap-4 px-6 md:px-12 xl:px-20">
        <a
          href="#top"
          aria-label="Monograph — back to the frontispiece"
          className="flex min-h-[44px] items-center gap-2.5"
        >
          <span aria-hidden="true" className="h-2 w-2 bg-accent" />
          <span className="t-label text-ink-1">{site.wordmark}</span>
        </a>

        <nav aria-label="Chapters" className="hidden items-center gap-7 lg:flex">
          {navChapters.map((c) => {
            const isCurrent = c.id === current;
            return (
              <a
                key={c.id}
                href={`#${c.id}`}
                aria-current={isCurrent ? "location" : undefined}
                className={
                  "t-mono-sm uppercase transition-colors duration-150 " +
                  (isCurrent ? "text-ink-1" : "text-ink-3 hover:text-ink-1")
                }
                style={
                  isCurrent
                    ? { boxShadow: "inset 0 -2px 0 0 var(--color-accent)" }
                    : undefined
                }
              >
                <span aria-hidden="true" className="mr-1.5 hidden text-ink-4 xl:inline">
                  {c.no}
                </span>
                {c.title}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            ref={searchOpenerRef}
            type="button"
            onClick={onOpenSearch}
            className="t-mono-sm flex min-h-[44px] items-center gap-2 px-2 uppercase text-ink-3 transition-colors duration-150 hover:text-ink-1"
            aria-label="Search this site (opens a dialog)"
          >
            Search
            <kbd
              aria-hidden="true"
              className="hidden border border-line-1 px-1.5 py-0.5 font-[inherit] text-[10px] text-ink-4 sm:inline"
            >
              /
            </kbd>
          </button>
          <button
            type="button"
            onClick={onCycleTheme}
            aria-label={`Color scheme: ${mode}. Switch to ${NEXT_MODE[mode]}.`}
            title={`Color scheme: ${mode}`}
            className="t-mono-sm min-h-[44px] px-2 uppercase text-ink-3 transition-colors duration-150 hover:text-ink-1"
          >
            {mode}
          </button>
          <button
            ref={indexOpenerRef}
            type="button"
            onClick={onOpenIndex}
            className="t-mono-sm min-h-[44px] px-2 uppercase text-ink-3 transition-colors duration-150 hover:text-ink-1 lg:hidden"
            aria-haspopup="dialog"
          >
            Index
          </button>
        </div>
      </div>

      {/* Mobile running head: the "you are here" of the pocket edition. */}
      <div className="h-7 overflow-hidden lg:hidden">
        <p
          className={
            "t-mono-sm px-6 uppercase text-ink-3 transition-opacity duration-200 " +
            (currentChapter ? "opacity-100" : "opacity-0")
          }
        >
          {currentChapter ? `§${currentChapter.no} — ${currentChapter.title}` : " "}
        </p>
      </div>
    </header>
  );
}
