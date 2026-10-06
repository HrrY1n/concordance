import { Link } from "react-router-dom";
import { corpusReading, sections } from "@/lib/sections";
import { colophonHonesty } from "@/content/lab";
import { site } from "@/content/site";
import { Mark } from "@/components/Header";

declare const __BUILD_DATE__: string;

/**
 * The colophon. Every number is a real count or a real date; the one standing
 * honesty declaration (§4 / M4) lives here — on the book's back page, not on
 * every module's face.
 */
export function Footer() {
  return (
    <footer className="no-print border-t border-line" style={{ marginBottom: "env(safe-area-inset-bottom)" }}>
      <div className="wrap py-12 md:py-16">
        {/* P0-1: an `auto` track sizes a flex-wrap nav to its UNWRAPPED
            max-content (~850px), which starved the left column at 768-1024px
            (0px wide, one word per line). The nav track is now capped at 40%
            and the nav wraps inside it; below lg the footer stacks. */}
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,40%)] lg:items-end">
          <div>
            <p className="t-entry flex items-center gap-2.5">
              <Mark className="h-4 w-4 text-ink" />
              {site.name}
            </p>
            <p className="t-small text-ink-2 mt-3 max-w-[52ch]">{site.tagline}</p>
            <p className="t-meta text-ink-2 mt-5 max-w-[62ch]">{colophonHonesty}</p>
          </div>

          <nav aria-label="Section addresses" className="t-meta text-ink-2">
            <ul className="flex flex-wrap gap-x-2 gap-y-1 lg:justify-end">
              {sections.map((s) => (
                <li key={s.id}>
                  {/* inline anchors ignore min-height unless they become flex
                      containers — this is the G3 fix for the 14px footer links. */}
                  <Link
                    to={s.route}
                    className="inline-flex min-h-[44px] items-center px-1 hover:text-ink transition-colors"
                  >
                    §{s.num} {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="t-meta text-ink-2 mt-10 flex flex-col gap-2 border-t border-line pt-5 md:flex-row md:justify-between">
          <p>{corpusReading()}</p>
          <p className="md:text-right">
            build {__BUILD_DATE__} · 0 analytics · 0 trackers · set in inter + newsreader
          </p>
        </div>
      </div>
    </footer>
  );
}
