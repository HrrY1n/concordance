import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { corpusReading, sections } from "@/lib/sections";
import { lockScroll, setOverlayOpen, trapTab } from "@/lib/focus";
import { useTheme } from "@/lib/theme";
import { Mark } from "@/components/Header";
import { brand, site } from "@/content/site";

const THEME_OPTIONS = [
  { value: "system", label: "自动" },
  { value: "light", label: "浅色" },
  { value: "dark", label: "深色" },
] as const;

/** 桌面级无级单选组 —— 键盘方向键无障碍切换色彩方案 */
export function ThemeRadiogroup() {
  const { choice, setChoice } = useTheme();
  const move = (dir: 1 | -1) => {
    const idx = THEME_OPTIONS.findIndex((o) => o.value === choice);
    setChoice(THEME_OPTIONS[(idx + (dir === 1 ? 1 : 2)) % 3].value);
  };
  const radios = (parent: HTMLElement | null) =>
    parent?.querySelectorAll<HTMLButtonElement>('[role="radio"]');
  return (
    <div role="radiogroup" aria-label="色彩主题切换" className="flex items-stretch">
      {THEME_OPTIONS.map((o, i) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={choice === o.value}
          tabIndex={choice === o.value ? 0 : -1}
          onClick={() => setChoice(o.value)}
          onKeyDown={(e) => {
            const list = radios(e.currentTarget.parentElement);
            if (e.key === "ArrowRight") {
              e.preventDefault();
              move(1);
              list?.[(i + 1) % 3]?.focus();
            } else if (e.key === "ArrowLeft") {
              e.preventDefault();
              move(-1);
              list?.[(i + 2) % 3]?.focus();
            }
          }}
          className={`t-meta min-h-[44px] px-3 transition-colors ${
            choice === o.value ? "bg-inset text-ink font-medium" : "text-ink-2 hover:text-ink"
          } ${i > 0 ? "border-l border-line" : ""}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/**
 * 移动端全屏目录（Mobile index）—— 专为触摸优化的 44px+ 舒适触控行。
 * 中文优先，具备安全区与严密焦点陷阱保护。
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
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label="全站索引目录 (Site index)"
      className="fixed inset-0 z-50 flex flex-col bg-bg"
      style={{
        paddingTop: "env(safe-area-inset-top)",
        paddingLeft: "env(safe-area-inset-left)",
        paddingRight: "env(safe-area-inset-right)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
      onKeyDown={(event) => trapTab(event.nativeEvent, panelRef.current)}
    >
      <div className="wrap flex h-16 shrink-0 items-center justify-between border-b border-line">
        <span className="t-meta text-ink flex items-center gap-2" aria-hidden="true">
          <Mark className="h-4 w-4" />
          <span className="font-medium">{brand}</span>
        </span>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="关闭网站索引 (Close site index)"
          className="flex min-h-[44px] min-w-[44px] items-center justify-center text-ink-2 transition-colors hover:text-ink"
        >
          <svg viewBox="0 0 20 20" width="19" height="19" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.7">
            <path d="m4 4 12 12M16 4 4 16" />
          </svg>
        </button>
      </div>

      <nav aria-label="章节导航" className="wrap flex-1 overflow-y-auto py-4">
        <ul>
          {sections.map((s) => (
            <li key={s.id} className="border-b border-line last:border-b-0">
              <Link
                to={s.route}
                onClick={onClose}
                className="flex min-h-[64px] items-baseline gap-4 py-4"
              >
                <span className="t-meta text-accent font-mono" aria-hidden="true">
                  §{s.num}
                </span>
                <span className="t-h3">{s.title}</span>
                <span className="t-meta text-ink-2 ml-auto text-right text-xs" aria-hidden="true">
                  {s.titleEn}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="wrap shrink-0 border-t border-line py-4 bg-inset/50">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenPalette();
            }}
            className="u-link t-small inline-flex min-h-[44px] items-center font-medium"
          >
            {site.searchLabel} →
          </button>
          <ThemeRadiogroup />
        </div>
        <p className="t-meta text-ink-2 mt-3 break-words font-mono text-xs">{corpusReading()}</p>
      </div>
    </div>
  );
}
