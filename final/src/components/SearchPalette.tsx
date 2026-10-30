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
 * 语录检索命令面板（The Concordance Palette）。
 * 支持双层结果：结构化编目条目（页面/作品/案例/主题/演示/动作）+ 语境行引言（KWIC 语境高亮）。
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

  const [openState, setOpenState] = useState(() => ({ open, initialQuery }));
  if (openState.open !== open || openState.initialQuery !== initialQuery) {
    setOpenState({ open, initialQuery });
    if (open) {
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
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className="fixed inset-0 z-[var(--z-overlay)] overflow-y-auto p-4 pt-[calc(1rem+env(safe-area-inset-top))] sm:p-6"
      style={{ background: "color-mix(in oklab, var(--ink) 32%, transparent)" }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          event.preventDefault();
          onClose();
        }
      }}
    >
      <div className="u-figure mx-auto mt-[8vh] w-full">
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

          {selection.truncated ? (
            <p className="t-meta text-ink-2 border-b border-line px-5 py-2 text-xs" aria-live="polite">
              当前展示前 {selection.shown.filter((r) => !r.action).length} 条（共 {selection.totalMatches} 条匹配）—— 请键入更多词缩小检索范围
            </p>
          ) : null}

          <ul id="palette-list" role="listbox" aria-label="检索结果" className="max-h-[48vh] overflow-y-auto">
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
                  className={`flex min-h-[44px] w-full items-baseline gap-3 px-5 py-2.5 text-left transition-colors ${
                    i === activeIdx ? "bg-inset" : "hover:bg-inset/50"
                  }`}
                >
                  <span className="t-meta t-caps text-ink-2 w-16 shrink-0 text-xs font-mono">{record.type}</span>
                  <span className="t-small text-ink min-w-0 flex-1 truncate">{record.title}</span>
                  <span className="t-meta text-ink-2 shrink-0 font-mono text-xs">{record.coord}</span>
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
                    className={`flex min-h-[44px] w-full items-baseline gap-3 px-5 py-2.5 text-left transition-colors ${
                      i === activeIdx ? "bg-inset" : "hover:bg-inset/50"
                    }`}
                  >
                    <span className="t-meta t-caps text-accent w-16 shrink-0 text-xs font-mono">引证</span>
                    <span className="t-small min-w-0 flex-1 truncate text-ink-2">
                      {kwic.left}
                      <mark className="bg-accent/20 text-ink px-0.5 rounded-sm">{kwic.match}</mark>
                      {kwic.right}
                    </span>
                    <span className="t-meta text-ink-2 shrink-0 font-mono text-xs">{quote.coord}</span>
                  </button>
                </li>
              );
            })}
            {optionCount === 0 ? (
              <li className="px-5 py-6">
                <p className="t-small text-ink-2" aria-live="polite">
                  未检索到与 <span className="font-mono text-ink">“{query}”</span> 匹配的内容
                </p>
                <p className="t-meta text-ink-2 mt-2">
                  推荐尝试检索：{paletteSuggestions.join(" · ")}
                </p>
              </li>
            ) : null}
          </ul>

          <div className="t-meta text-ink-2 flex flex-wrap items-center justify-between gap-2 border-t border-line px-5 py-3 font-mono text-xs">
            <span aria-live="polite">
              本地索引 · 共 {indexSize()} 条编目 · 0ms 纯前端运算
            </span>
            <span className="flex items-center gap-2" aria-hidden="true">
              <kbd className="px-1.5 py-0.5 border border-line rounded bg-bg">↑↓ 选择</kbd>
              <kbd className="px-1.5 py-0.5 border border-line rounded bg-bg">↵ 进入</kbd>
              <kbd className="px-1.5 py-0.5 border border-line rounded bg-bg">esc 关闭</kbd>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/** `?` 快捷键帮助浮层 */
export function HelpOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    setOverlayOpen(true);
    lockScroll(true);
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
        if (event.target === event.currentTarget) {
          event.preventDefault();
          onClose();
        }
      }}
    >
      <div className="mx-auto mt-[14vh] w-full max-w-[540px]">
        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label="快捷键帮助 (Keyboard help)"
          tabIndex={-1}
          className="border border-line-strong bg-raised p-6 outline-none md:p-8 shadow-xl"
          onKeyDown={(event) => trapTab(event.nativeEvent, dialogRef.current)}
        >
          <h2 className="t-entry">快捷键指南</h2>
          <dl className="mt-5 space-y-3">
            {[
              ["/ 或 ⌘K", "呼出全站检索命令面板"],
              ["?", "打开本快捷键帮助浮层"],
              ["esc", "关闭任意当前弹出的浮层"],
              ["tab", "无障碍遍历页面上所有焦点交互目标"],
            ].map(([key, what]) => (
              <div key={key} className="flex items-baseline justify-between gap-4">
                <dt>
                  <kbd className="px-2 py-1 text-xs border border-line rounded bg-bg font-mono">{key}</kbd>
                </dt>
                <dd className="t-small text-ink-2 text-right">{what}</dd>
              </div>
            ))}
          </dl>
          <h2 className="t-entry mt-8">章节坐标系统</h2>
          <p className="t-small text-ink-2 mt-3 leading-relaxed">
            每个页面均配备固定的章节地址坐标（§01–§07），命令面板检索命中项皆附带精准坐标指引。
            右上角主题切换按钮支持在「自动跟随系统 → 浅色暖纸 → 深色阅读室」之间循环切换并自动记住您的偏好。
          </p>
          <div className="mt-6 flex justify-end">
            <button type="button" onClick={onClose} className="u-link t-small inline-flex min-h-[44px] items-center">
              关闭帮助 (Close)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
