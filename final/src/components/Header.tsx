import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { sections } from "@/lib/sections";
import { useTheme } from "@/lib/theme";
import { brand, site } from "@/content/site";

/** 站点标志：三档阶梯排位柱 —— 象征检索排名的严谨律动 */
export function Mark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 18 18"
      aria-hidden="true"
      focusable="false"
      className={className}
      fill="currentColor"
    >
      <rect x="1" y="11" width="3.4" height="6" />
      <rect x="7.3" y="6" width="3.4" height="11" />
      <rect x="13.6" y="1" width="3.4" height="16" fill="var(--accent)" />
    </svg>
  );
}

function ThemeToggle() {
  const { choice, cycle } = useTheme();
  const next = choice === "system" ? "light" : choice === "light" ? "dark" : "system";
  const labelMap = { system: "自动", light: "浅色", dark: "深色" } as const;
  const nextMap = { system: "浅色", light: "深色", dark: "自动" } as const;
  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={`Color scheme: ${choice}. Activate to switch to ${next}. 当前色彩主题：${labelMap[choice]}，点击切换至${nextMap[choice]}`}
      className="t-meta text-ink-2 hover:text-ink min-h-[44px] px-2.5 transition-colors font-mono whitespace-nowrap shrink-0"
    >
      {labelMap[choice]}
    </button>
  );
}

export { ThemeToggle };

/**
 * 顶部导航 Header —— 常驻的坐标路径与主理人品牌。
 * 坐标系兼任全站主导航，当前活动章节带有强调下划线。
 */
export function Header({
  onOpenPalette,
  onOpenMenu,
}: {
  onOpenPalette: () => void;
  onOpenMenu: () => void;
}) {
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(() =>
    typeof window === "undefined" ? false : window.scrollY > 24,
  );
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const [prevPath, setPrevPath] = useState(pathname);
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setActiveSection(null);
  }

  const isHome = pathname === "/";
  useEffect(() => {
    if (!isHome) return;
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-section]"));
    if (els.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection((entry.target as HTMLElement).dataset.section ?? null);
          }
        }
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [isHome]);

  return (
    <header
      className={`no-print fixed inset-x-0 top-0 z-[var(--z-header)] transition-colors duration-200 ${
        scrolled ? "border-b border-line bg-bg/95 backdrop-blur-sm" : "border-b border-transparent bg-transparent"
      }`}
      style={{
        paddingTop: "env(safe-area-inset-top)",
        paddingLeft: "env(safe-area-inset-left)",
        paddingRight: "env(safe-area-inset-right)",
      }}
    >
      <div className="wrap flex h-16 items-center gap-2 md:gap-4">
        <Link
          to="/"
          className="group flex min-h-[44px] min-w-0 shrink items-center gap-2 pr-1.5 transition-opacity hover:opacity-85"
          aria-label={`${brand} — 首页`}
        >
          <Mark className="h-[18px] w-[18px] text-ink shrink-0" />
          <span className="t-entry tracking-[0.01em] font-medium truncate">{brand}</span>
        </Link>

        <nav aria-label="全站章节导航" className="ml-4 hidden flex-1 lg:block">
          <ul className="flex items-center gap-5">
            {sections.map((s) => {
              const current = s.route === pathname || (isHome && activeSection === s.id);
              return (
                <li key={s.id}>
                  <Link
                    to={s.route}
                    aria-current={s.route === pathname ? "page" : undefined}
                    className={`group flex min-h-[44px] items-baseline gap-1.5 transition-colors ${
                      current ? "text-ink font-medium" : "text-ink-2 hover:text-ink"
                    }`}
                  >
                    <span className="t-meta text-accent" aria-hidden="true">
                      §{s.num}
                    </span>
                    <span className="t-small">
                      <span
                        className={
                          current
                            ? "underline decoration-accent decoration-2 underline-offset-[6px]"
                            : ""
                        }
                      >
                        {s.title}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-1 sm:gap-1.5 lg:ml-0 shrink-0">
          <ThemeToggle />
          <button
            type="button"
            onClick={onOpenPalette}
            aria-label={`${site.searchLabel} — 按 / 键检索 (press slash)`}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center gap-1.5 rounded text-ink-2 transition-colors hover:text-ink hover:bg-inset shrink-0"
          >
            <svg viewBox="0 0 20 20" width="17" height="17" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.7">
              <circle cx="9" cy="9" r="5.5" />
              <path d="m13.5 13.5 4 4" />
            </svg>
            <kbd className="hidden xl:inline text-xs font-mono px-1.5 py-0.5 border border-line rounded bg-raised text-ink-2">/</kbd>
          </button>
          <button
            type="button"
            onClick={onOpenMenu}
            aria-label="打开网站导航目录 (Open site index)"
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded text-ink-2 transition-colors hover:text-ink hover:bg-inset lg:hidden shrink-0"
          >
            <svg viewBox="0 0 20 20" width="19" height="19" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.7">
              <path d="M2 5h16M2 10h16M2 15h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
