import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import { useFocusTrap, useMediaQuery, useScrollLock, useScrollSpy } from "../lib/hooks";
import { useTheme } from "../lib/theme";
import { site } from "../content/site";
import { notes } from "../content/writing";
import { projects } from "../content/projects";
import { publications } from "../content/publications";
import { researchQuestions } from "../content/research";
import { labInstruments } from "../content/lab";

/* ------------------------------ nav model ------------------------------- */

export interface NavSection {
  id: string;
  num: string;
  label: string;
}

export const homeSections: NavSection[] = [
  { id: "research", num: "01", label: "Research" },
  { id: "work", num: "02", label: "Work" },
  { id: "publications", num: "03", label: "Publications" },
  { id: "lab", num: "04", label: "Lab" },
  { id: "notes", num: "05", label: "Notes" },
  { id: "about", num: "06", label: "About" },
];

/** Honest readings — counted from the content files, never hand-written. */
export function contentCounts(): string {
  return [
    `${researchQuestions.length} QUESTIONS`,
    `${projects.length} CASES`,
    `${publications.length} PUBLICATIONS`,
    `${notes.length} NOTES`,
    `${labInstruments.length} INSTRUMENT`,
  ].join(" · ");
}

/* ------------------------- skip link + landmarks ------------------------- */

export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:border focus:border-divider-strong focus:bg-paper focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:text-ink"
    >
      Skip to content
    </a>
  );
}

/* ------------------------------- reveal ---------------------------------- */

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const rm = useReducedMotion();
  if (rm) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.32, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------ sidenotes -------------------------------- */

/**
 * Three-stage degradation (the component picks one structure per breakpoint):
 *   ≥1120px  float into the right margin (pure CSS float — no measuring JS)
 *   ≥768px   inline block with a wash bar; secondary info stays demoted
 *   <768px   native <details> fold with numbered summary, no JS animation
 */
export function Noted({
  n,
  note,
  children,
}: {
  n: number;
  note: ReactNode;
  children: ReactNode;
}) {
  const isFloat = useMediaQuery("(min-width: 70rem)");
  const isInline = useMediaQuery("(min-width: 48rem)");
  const body = (
    <>
      <span className="type-mono mr-1 align-super">{n}</span>
      {note}
    </>
  );
  /* The measure wrapper is what floating sidenotes anchor against —
     without a bounded column the negative-margin float escapes the page. */
  return (
    <div className="measure">
      {isFloat ? <aside className="sn-float">{body}</aside> : null}
      <p className="type-body">{children}</p>
      {!isFloat ? (
        isInline ? (
          <aside className="sn-inline">{body}</aside>
        ) : (
          <details className="sn-fold">
            <summary aria-label={`Margin note ${n}`}>
              <span aria-hidden="true">[{n}]</span>
            </summary>
            <div className="type-note mt-1 pb-2">{note}</div>
          </details>
        )
      ) : null}
    </div>
  );
}

/** Visible superscript marking the anchor point (decorative to AT). */
export function NoteMark({ n }: { n: number }) {
  return (
    <sup className="sn-num" aria-hidden="true">
      {n}
    </sup>
  );
}

/* ---------------------------- section header ----------------------------- */

export function SectionHead({
  num,
  kicker,
  title,
  lede,
}: {
  num: string;
  kicker: string;
  title: string;
  lede?: string;
}) {
  return (
    <header className="border-t border-divider pt-4">
      <div className="lg:grid lg:grid-cols-[minmax(0,60ch)_minmax(0,21ch)] lg:gap-x-16">
        <div>
          <p className="type-label">{kicker}</p>
          <h2 className="type-h2 mt-3 text-ink-strong">{title}</h2>
          {lede ? <p className="type-lede mt-4">{lede}</p> : null}
        </div>
        <p className="type-mono mt-4 lg:mt-1 lg:text-right">§{num}</p>
      </div>
    </header>
  );
}

/* ---------------------------- theme control ------------------------------ */

const THEME_OPTIONS = [
  { value: "system", label: "Sys" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
] as const;

function ThemeRadiogroup() {
  const { pref, setPref } = useTheme();
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const idx = THEME_OPTIONS.findIndex((o) => o.value === pref);
    const next = e.key === "ArrowRight" ? (idx + 1) % 3 : (idx + 2) % 3;
    setPref(THEME_OPTIONS[next].value);
    e.currentTarget.querySelectorAll<HTMLButtonElement>('[role="radio"]')[next]?.focus();
  };
  return (
    <div
      role="radiogroup"
      aria-label="Colour theme"
      onKeyDown={onKeyDown}
      className="flex items-stretch border border-divider-strong"
    >
      {THEME_OPTIONS.map((o, i) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={pref === o.value}
          tabIndex={pref === o.value ? 0 : -1}
          onClick={() => setPref(o.value)}
          className={`px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.08em] transition-colors duration-150 ${
            pref === o.value
              ? "bg-deep text-ink-strong"
              : "text-ink-soft hover:text-ink"
          } ${i > 0 ? "border-l border-divider-strong" : ""}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function ThemeCycleButton() {
  const { pref, cycle, resolved } = useTheme();
  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={`Colour theme: ${pref} (showing ${resolved}). Activate to change.`}
      className="border border-divider-strong px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-2 transition-colors duration-150 hover:text-ink-strong lg:hidden"
    >
      Theme: {pref}
    </button>
  );
}

export function ThemeControl() {
  return (
    <>
      <div className="hidden lg:block">
        <ThemeRadiogroup />
      </div>
      <ThemeCycleButton />
    </>
  );
}

/* -------------------------------- header --------------------------------- */

function useScrolled(after: number): boolean {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > after);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [after]);
  return scrolled;
}

function ReadingProgress() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let ticking = false;
    const update = () => {
      ticking = false;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      if (ref.current) ref.current.style.transform = `scaleX(${p})`;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  return (
    <div className="absolute inset-x-0 bottom-0 h-[2px]" aria-hidden="true">
      <div
        ref={ref}
        className="h-full origin-left bg-ink-soft"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}

export function Header({
  onOpenContents,
  reading = false,
}: {
  onOpenContents?: () => void;
  reading?: boolean;
}) {
  const scrolled = useScrolled(8);
  const ids = useMemo(() => homeSections.map((s) => s.id), []);
  const active = useScrollSpy(ids);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-200 ${
        scrolled ? "border-b border-divider bg-paper" : "border-b border-transparent"
      }`}
    >
      <div className="shell flex h-14 items-center justify-between gap-4">
        <Link
          to="/"
          className="font-mono text-xs font-medium tracking-[0.14em] text-ink-strong"
        >
          OFFPRINT
          <span className="ml-2 hidden text-ink-soft sm:inline">· WORKING EDITION</span>
        </Link>

        <nav aria-label="Sections" className="hidden items-center gap-5 lg:flex">
          {homeSections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              aria-current={active === s.id ? "true" : undefined}
              className={`relative py-1 font-mono text-[11px] uppercase tracking-[0.08em] transition-colors duration-150 ${
                active === s.id ? "text-ink-strong" : "text-ink-soft hover:text-ink"
              }`}
            >
              {s.num} {s.label}
              {active === s.id ? (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute inset-x-0 -bottom-0.5 h-[2px] bg-ink-strong"
                  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                />
              ) : null}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeControl />
          {onOpenContents ? (
            <button
              type="button"
              onClick={onOpenContents}
              className="border border-divider-strong px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-2 transition-colors duration-150 hover:text-ink-strong lg:hidden"
            >
              Contents
            </button>
          ) : null}
        </div>
      </div>
      {reading ? <ReadingProgress /> : null}
    </header>
  );
}

/* ------------------------------- overlays -------------------------------- */

function Overlay({
  open,
  onClose,
  label,
  children,
}: {
  open: boolean;
  onClose: () => void;
  label: string;
  children: ReactNode;
}) {
  const rm = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  useFocusTrap(open, panelRef, onClose);
  useScrollLock(open);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={label}>
      <div className="absolute inset-0 bg-paper" aria-hidden="true" />
      <motion.div
        ref={panelRef}
        initial={rm ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="absolute inset-0 overflow-y-auto"
      >
        {children}
      </motion.div>
    </div>
  );
}

export function ContentsOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Overlay open={open} onClose={onClose} label="Contents">
      <div className="shell flex min-h-full flex-col pb-10 pt-20">
        <div className="flex items-baseline justify-between">
          <p className="type-label">CONTENTS — THE WHOLE EDITION</p>
          <button
            type="button"
            onClick={onClose}
            className="border border-divider-strong px-3 py-2 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-2 hover:text-ink-strong"
          >
            Close [Esc]
          </button>
        </div>
        <nav aria-label="All sections" className="mt-8">
          <ul>
            {homeSections.map((s) => (
              <li key={s.id} className="border-t border-divider first:border-t-0">
                <a href={`#${s.id}`} onClick={onClose} className="group flex items-baseline gap-6 py-4">
                  <span className="type-mono w-8 shrink-0">{s.num}</span>
                  <span className="type-h2 text-ink group-hover:underline group-hover:decoration-divider-strong group-hover:underline-offset-4">
                    {s.label}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <p className="type-mono mt-auto pt-10">{contentCounts()}</p>
      </div>
    </Overlay>
  );
}

export function HelpOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const rows: [string, string][] = [
    ["T", "Cycle colour theme: system → light → dark"],
    ["?", "Open or close this shortcut list"],
    ["Esc", "Close the overlay you are in"],
    ["Tab", "Move through every control — nothing is pointer-only"],
    ["Enter / Space", "Activate buttons and toggles (demos included)"],
  ];
  return (
    <Overlay open={open} onClose={onClose} label="Keyboard shortcuts">
      <div className="shell max-w-[60ch] pb-10 pt-24">
        <div className="flex items-baseline justify-between">
          <p className="type-label">KEYBOARD</p>
          <button
            type="button"
            onClick={onClose}
            className="border border-divider-strong px-3 py-2 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-2 hover:text-ink-strong"
          >
            Close [Esc]
          </button>
        </div>
        <h2 className="type-h2 mt-6 text-ink-strong">Every key that does something.</h2>
        <dl className="mt-8">
          {rows.map(([k, desc]) => (
            <div key={k} className="flex items-baseline gap-6 border-t border-divider py-3">
              <dt className="w-28 shrink-0">
                <span className="kbd">{k}</span>
              </dt>
              <dd className="type-body">{desc}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Overlay>
  );
}

/* -------------------------------- footer --------------------------------- */

export function Colophon() {
  return (
    <footer id="colophon" className="section bg-deep">
      <div className="shell">
        <div className="lg:grid lg:grid-cols-[minmax(0,60ch)_minmax(0,21ch)] lg:gap-x-16">
          <div>
            <p className="type-label">§07 · COLOPHON</p>
            <p className="type-mono mt-6">
              OFFPRINT — {site.edition.toUpperCase()} · BUILT {__BUILD_DATE__}
            </p>
            <p className="type-mono mt-2">SET IN {site.fonts.toUpperCase()}</p>
            <p className="type-mono mt-2">
              NO TRACKERS · NO NETWORK REQUESTS · ALL COMPUTATION LOCAL
            </p>
            <p className="type-mono mt-2">{contentCounts()} — COUNTED FROM SRC/CONTENT</p>
            <p className="type-note mt-6 max-w-[52ch]">
              Every string on this page lives in{" "}
              <code className="font-mono">src/content/*.ts</code>. Replace the data and the
              layout holds.
            </p>
          </div>
          <div className="mt-8 lg:mt-1 lg:text-right">
            <p className="type-label">KEYS</p>
            <p className="type-mono mt-3">
              <span className="kbd">T</span> THEME · <span className="kbd">?</span> SHORTCUTS
            </p>
            <p className="type-mono mt-4">© 2026 — THE ARCHIVE BEGINS</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* --------------------------- route behaviours ---------------------------- */

export function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      // Cross-route anchor (e.g. /#research): wait one tick for the
      // section to mount, then jump to it.
      const id = decodeURIComponent(hash.slice(1));
      const t = window.setTimeout(() => {
        document.getElementById(id)?.scrollIntoView();
      }, 60);
      return () => window.clearTimeout(t);
    }
    window.scrollTo(0, 0);
    document.getElementById("main-content")?.focus({ preventScroll: true });
  }, [pathname, hash]);
  return null;
}
