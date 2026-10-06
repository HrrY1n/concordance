import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, Search } from "lucide-react";
import { sections } from "@/lib/sections";
import { useTheme } from "@/lib/theme";

function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { choice, cycle } = useTheme();
  const next = choice === "system" ? "light" : choice === "light" ? "dark" : "system";
  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={`Color scheme: ${choice}. Activate to switch to ${next}.`}
      className="t-meta t-caps text-muted hover:text-ink min-h-[44px] px-2 transition-colors"
    >
      {compact ? choice.slice(0, 4) : choice}
    </button>
  );
}

/**
 * Header — the always-visible conventional path (dual-channel principle:
 * the palette is an increment, never a gate). Section numbers double as the
 * site's coordinate system; the current section carries the page's only
 * persistent accent underline.
 */
export function Header({
  onOpenPalette,
  onOpenMenu,
}: {
  onOpenPalette: () => void;
  onOpenMenu: () => void;
}) {
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isHome = pathname === "/";
  useEffect(() => {
    if (!isHome) {
      setActiveSection(null);
      return;
    }
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
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-200 ${
        scrolled ? "border-b border-line bg-bg" : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="wrap flex h-16 items-center gap-2 md:gap-4">
        <Link
          to="/"
          className="flex min-h-[44px] items-center gap-2 pr-2"
          aria-label="A Retrievable Self — home"
        >
          <span aria-hidden="true" className="text-accent text-[22px] leading-none">
            ⌕
          </span>
          <span className="t-meta t-caps text-muted hidden sm:inline">retrieval index</span>
        </Link>

        <nav aria-label="Sections" className="ml-4 hidden flex-1 lg:block">
          <ul className="flex items-center gap-6">
            {sections.map((s) => {
              const current = s.route === pathname || (isHome && activeSection === s.id);
              return (
                <li key={s.id}>
                  <Link
                    to={s.route}
                    aria-current={s.route === pathname ? "page" : undefined}
                    className={`group flex min-h-[44px] items-baseline gap-2 ${
                      current ? "text-ink" : "text-muted hover:text-ink"
                    } transition-colors`}
                  >
                    <span className="t-meta" aria-hidden="true">
                      {s.num}
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

        <div className="ml-auto flex items-center gap-1 lg:ml-0">
          <ThemeToggle />
          <button
            type="button"
            onClick={onOpenPalette}
            aria-label="Search this site — press slash"
            className="flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 text-muted hover:text-ink transition-colors"
          >
            <Search size={18} aria-hidden="true" />
            <kbd className="hidden xl:inline">/</kbd>
          </button>
          <button
            type="button"
            onClick={onOpenMenu}
            aria-label="Open index"
            className="flex min-h-[44px] min-w-[44px] items-center justify-center text-muted hover:text-ink transition-colors lg:hidden"
          >
            <Menu size={20} aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
}

export { ThemeToggle };
