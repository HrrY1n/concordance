import { Link } from "react-router-dom";
import { colophonHonesty, corpusReading, sections } from "@/lib/sections";
import { brand, site } from "@/content/site";
import { Mark } from "@/components/Header";

declare const __BUILD_DATE__: string;

/**
 * 页脚声明（The Colophon）。
 * 遵循古典书籍封底体例：所有数字均为真实数据计算派生，
 * 唯一的全站诚实性声明在此静默呈现。
 */
export function Footer() {
  return (
    <footer className="no-print border-t border-line" style={{ marginBottom: "env(safe-area-inset-bottom)" }}>
      <div className="wrap py-12 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,42%)] lg:items-end">
          <div>
            <p className="t-entry flex items-center gap-2.5">
              <Mark className="h-4 w-4 text-ink" />
              {brand}
            </p>
            <p className="t-small text-ink-2 mt-3 max-w-[54ch]">{site.tagline}</p>
            <p className="t-meta text-ink-2 mt-5 max-w-[62ch]">{colophonHonesty}</p>
          </div>

          <nav aria-label="全站章节索引导航" className="t-meta text-ink-2">
            <ul className="flex flex-wrap gap-x-2 gap-y-1 lg:justify-end">
              {sections.map((s) => (
                <li key={s.id}>
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
          <p className="font-mono">{corpusReading()}</p>
          <p className="md:text-right font-mono">
            构建版本 {__BUILD_DATE__} · 0 第三方埋点 · 0 跟踪脚本 · 字体由 Inter + Newsreader 驱动
          </p>
        </div>
      </div>
    </footer>
  );
}
