import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { sections, type SectionMeta } from "@/lib/sections";

/**
 * Shared frames. Section = one full-bleed hairline + coordinate + kicker +
 * honest reading + serif waymark. PageShell = same grammar at page-title step.
 *
 * The `register` prop is REAL (P2-19): it lands on data-register and the CSS
 * in index.css (REGISTERS block) owns the vertical rhythm per register —
 * LEDGER blocks sit tight, PLATE blocks breathe, ESSAY blocks read. PageShell
 * additionally carries .page-shell; LEDGER pages get less top air than PLATE.
 */

export type Register = "ledger" | "plate" | "essay";

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
        <span className="t-kicker text-ink-2">{meta.kicker}</span>
        {meta.reading ? (
          <span className="t-meta text-faint ml-auto hidden sm:inline" aria-hidden="true">
            {meta.reading}
          </span>
        ) : null}
      </div>
      <Heading id={`${meta.id}-title`} className={`${level === 1 ? "t-h1" : "t-h2"} mt-4`}>
        {meta.title}
      </Heading>
      {lede ? <p className="t-lede text-ink-2 mt-5 max-w-[56ch]">{lede}</p> : null}
    </header>
  );
}

export function Section({
  meta,
  lede,
  register = "ledger",
  children,
  first = false,
}: {
  meta: SectionMeta;
  lede?: string;
  register?: Register;
  children: ReactNode;
  first?: boolean;
}) {
  return (
    <section
      id={meta.id}
      data-section={meta.id}
      data-register={register}
      aria-labelledby={`${meta.id}-title`}
      className={`${first ? "" : "border-t border-line"}`}
    >
      <div className="wrap">
        <SectionHeader meta={meta} lede={lede} />
        <div className="mt-10 md:mt-12">{children}</div>
      </div>
    </section>
  );
}

/** Standalone route page frame — same header grammar, page-title step. The
 *  register lands on data-register (consumed by .page-shell rules in CSS). */
export function PageShell({
  meta,
  lede,
  register = "ledger",
  children,
}: {
  meta: SectionMeta;
  lede?: string;
  register?: Register;
  children: ReactNode;
}) {
  return (
    <div className="page-shell" data-register={register} id={meta.id}>
      <div className="wrap">
        <SectionHeader meta={meta} level={1} lede={lede} />
        <div className="mt-10 md:mt-14">{children}</div>
      </div>
    </div>
  );
}

/**
 * EmptyState — the site's shared ghost grammar (P2-22): a reserved mark, one
 * sentence of why, one sentence of how it becomes real. Used wherever the
 * archive shows an intentional absence (About identity, publications ghost
 * rows, connect slots follow the same grammar).
 */
export function EmptyState({
  mark,
  why,
  becomes,
  className = "",
}: {
  mark: string;
  why: string;
  becomes?: string;
  className?: string;
}) {
  return (
    <div className={`border-t border-dashed border-line-strong pt-4 ${className}`}>
      <p className="t-meta t-caps text-ink-2">{mark}</p>
      <p className="t-small text-ink-2 mt-2 max-w-[58ch]">{why}</p>
      {becomes ? <p className="t-small text-ink-2 mt-1 max-w-[58ch]">{becomes}</p> : null}
    </div>
  );
}

/**
 * FIG — the "data as pigment" grammar, site-wide (§4 / M2). A figure is a
 * real computation shown in the browser, captioned with its id and the exact
 * method. Anything inside must be computed from content at render time.
 */
export function Figure({
  id,
  title,
  method,
  children,
  className = "",
}: {
  id: string;
  title: string;
  method: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <figure className={`border-y border-line py-4 ${className}`} aria-label={`${id} — ${title}`}>
      <figcaption className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <span className="t-meta t-caps text-ink">
          {id} — {title}
        </span>
        <span className="t-meta text-ink-2" data-method="true">
          {method}
        </span>
      </figcaption>
      <div className="mt-4">{children}</div>
    </figure>
  );
}

/** Cross-reference link with the site's arrow grammar. Inline-flex so the
 *  target is a real 44px touch row on coarse pointers (G3 / P0-14). */
export function XRef({ to, children }: { to: string; children: ReactNode }) {
  const external = to.startsWith("http");
  if (external) {
    return (
      <a href={to} target="_blank" rel="noreferrer" className="u-link t-small inline-flex min-h-[44px] items-center">
        {children}
        <span aria-hidden="true"> ↗</span>
      </a>
    );
  }
  return (
    <Link to={to} className="u-link t-small inline-flex min-h-[44px] items-center">
      {children}
      <span aria-hidden="true"> →</span>
    </Link>
  );
}

/** The six/seven addresses, for footers and overlays. */
export function SectionList({ render }: { render: (meta: SectionMeta) => ReactNode }) {
  return (
    <ul>
      {sections.map((s) => (
        <li key={s.id}>{render(s)}</li>
      ))}
    </ul>
  );
}
