import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { X } from "lucide-react";
import { sections } from "@/lib/sections";
import { corpusReading } from "@/lib/sections";
import { lockScroll, setOverlayOpen, trapTab } from "@/lib/focus";
import { ThemeToggle } from "@/components/Header";

/**
 * Mobile index — a full-screen table of contents with 44px+ rows (B's
 * contents-page idea, re-keyed to the coordinate system). This is the
 * re-designed mobile navigation, not a shrunken desktop bar.
 */
export function MobileMenu({
  open,
  onClose,
  onOpenPalette,
}: {
  open: boolean;
  onClose: () => void;
  onOpenPalette: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    setOverlayOpen(true);
    lockScroll(true);
    const timer = window.setTimeout(() => closeRef.current?.focus(), 20);
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
    <motion.div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label="Site index"
      className="fixed inset-0 z-50 flex flex-col bg-bg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.16 }}
      onKeyDown={(event) => trapTab(event.nativeEvent, panelRef.current)}
    >
      <div className="wrap flex h-16 shrink-0 items-center justify-between">
        <span className="t-meta t-caps text-muted" aria-hidden="true">
          ⌕ index
        </span>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close index"
          className="flex min-h-[44px] min-w-[44px] items-center justify-center text-muted hover:text-ink transition-colors"
        >
          <X size={20} aria-hidden="true" />
        </button>
      </div>

      <nav aria-label="Sections" className="wrap flex-1 overflow-y-auto pb-8">
        <ul>
          {sections.map((s) => (
            <li key={s.id} className="border-b border-line">
              <Link
                to={s.route}
                onClick={onClose}
                className="flex min-h-[56px] items-baseline gap-4 py-3"
              >
                <span className="t-meta text-accent" aria-hidden="true">
                  §{s.num}
                </span>
                <span className="font-display text-[24px] leading-8 font-medium tracking-[-0.01em] text-ink">
                  {s.title}
                </span>
                {s.reading ? (
                  <span className="t-meta text-faint ml-auto text-right">{s.reading}</span>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="wrap shrink-0 border-t border-line py-4">
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenPalette();
            }}
            className="u-link t-small min-h-[44px]"
          >
            Search this site
          </button>
          <ThemeToggle />
        </div>
        <p className="t-meta t-caps text-faint mt-3 break-words">{corpusReading()}</p>
      </div>
    </motion.div>
  );
}
