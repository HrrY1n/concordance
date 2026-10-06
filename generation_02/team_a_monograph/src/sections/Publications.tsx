import { Section } from "../components/Section";
import { chapters } from "../content/chapters";
import { publications } from "../content/publications";

/**
 * §04 — the empty ledger, kept on stage on purpose: “preparing” is itself
 * true information. Ghost slots are the reserved hairlines of entries to
 * come (aria-hidden — decoration, not content). No “coming soon” banners.
 */
export function PublicationsSection() {
  const chapter = chapters.find((c) => c.id === "publications")!;
  const ghostSlots = 2;
  return (
    <Section chapter={chapter}>
      <p className="t-mono uppercase text-ink-3">
        {publications.length} RECORDS
      </p>
      <p className="t-lede mt-4 max-w-[46ch]">
        Selected publications will appear here — the ledger is open, the work is
        still being written.
      </p>

      <div aria-hidden="true" className="mt-12">
        {Array.from({ length: ghostSlots }, (_, i) => i + 1).map((n) => (
          <div
            key={n}
            className="flex items-center justify-between border-t border-line-1 py-4 last:border-b"
          >
            <span className="t-mono-sm text-ink-4">{String(n).padStart(2, "0")}</span>
            <span className="t-mono-sm text-ink-4">RESERVED</span>
          </div>
        ))}
      </div>

      <p className="t-mono-sm mt-10 text-ink-4 uppercase">
        Ledger open — last set {__BUILD_DATE__}
      </p>
    </Section>
  );
}
