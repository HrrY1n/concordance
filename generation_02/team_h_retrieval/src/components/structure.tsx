import type { ReactNode } from "react";
import { sections, type SectionMeta } from "@/lib/sections";

/**
 * Shared section frame: one full-bleed hairline per section (the entire
 * decorative-line budget), a coordinate, a kicker, an honest reading,
 * and the serif waymark. Level 1 = route page title (38px step),
 * level 2 = home section header (48px step).
 */
export function SectionHeader({
  meta,
  level = 2,
  lede,
}: {
  meta: SectionMeta;
  level?: 1 | 2;
  lede?: string;
}) {
  const Heading = (level === 1 ? "h1" : "h2") as "h1" | "h2";
  return (
    <header>
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
        <span className="t-meta text-accent" aria-hidden="true">
          §{meta.num}
        </span>
        <span className="t-kicker text-muted">{meta.kicker}</span>
        {meta.reading ? (
          <span className="t-meta text-faint ml-auto hidden sm:inline">{meta.reading}</span>
        ) : null}
      </div>
      <Heading id={`${meta.id}-title`} className={`${level === 1 ? "t-h1" : "t-h2"} mt-4`}>
        {meta.title}
      </Heading>
      {lede ? <p className="t-lead text-muted mt-6 max-w-[56ch]">{lede}</p> : null}
    </header>
  );
}

export function Section({
  meta,
  lede,
  children,
  first = false,
}: {
  meta: SectionMeta;
  lede?: string;
  children: ReactNode;
  first?: boolean;
}) {
  return (
    <section
      id={meta.id}
      data-section={meta.id}
      aria-labelledby={`${meta.id}-title`}
      className={`${first ? "" : "border-t border-line"} py-20 md:py-28`}
    >
      <div className="wrap">
        <SectionHeader meta={meta} lede={lede} />
        <div className="mt-10 md:mt-14">{children}</div>
      </div>
    </section>
  );
}

/** Standalone route page frame — same header grammar, page-title step. */
export function PageShell({
  meta,
  lede,
  children,
}: {
  meta: SectionMeta;
  lede?: string;
  children: ReactNode;
}) {
  return (
    <div className="pt-28 pb-20 md:pt-36 md:pb-28" id={meta.id}>
      <div className="wrap">
        <SectionHeader meta={meta} level={1} lede={lede} />
        <div className="mt-10 md:mt-14">{children}</div>
      </div>
    </div>
  );
}

/** The six addresses, for footers and overlays. */
export function SectionList({
  render,
}: {
  render: (meta: SectionMeta) => ReactNode;
}) {
  return (
    <ul>
      {sections.map((s) => (
        <li key={s.id}>{render(s)}</li>
      ))}
    </ul>
  );
}
