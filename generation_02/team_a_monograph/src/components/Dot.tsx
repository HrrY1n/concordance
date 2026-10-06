/**
 * The status dot — accent semantics made visible:
 *   alive  → filled orange  (a running question, active work, the live signal)
 *   open   → hollow ring    (real but not currently burning)
 *   quiet  → gray           (parked, archived)
 */
export function Dot({ tone }: { tone: "alive" | "open" | "quiet" }) {
  if (tone === "alive") {
    return <span aria-hidden="true" className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />;
  }
  if (tone === "open") {
    return <span aria-hidden="true" className="inline-block h-1.5 w-1.5 shrink-0 rounded-full border border-ink-3" />;
  }
  return <span aria-hidden="true" className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-ink-4" />;
}
