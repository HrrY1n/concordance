import { Link } from "react-router-dom";
import { sections } from "@/lib/sections";
import { useDocumentMeta } from "@/lib/seo";
import { useSearch } from "@/lib/palette";

/**
 * 404 — the coordinate system's honest failure mode: this address has no
 * record. Offers the palette (query the corpus instead) and the index.
 */
export default function NotFoundPage({ kind = "page" }: { kind?: "page" | "note" }) {
  useDocumentMeta("404 — no record at this address", "The corpus has no record at this address. Everything reachable is listed in the index.");
  const { openSearch } = useSearch();

  return (
    <div className="wrap flex min-h-[60vh] flex-col justify-center pb-20 pt-16">
      <p className="t-meta t-caps text-ink-2">
        404 · {kind === "note" ? "no note at this address" : "no record at this address"}
      </p>
      <h1 className="t-h1 mt-4 max-w-[24ch]">The concordance has no entry at this address.</h1>
      <p className="t-small text-ink-2 mt-5 max-w-[52ch]">
        The address system covers §01–§07. Everything reachable is listed in the index — or query
        the corpus directly.
      </p>
      <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
        <button type="button" className="u-chip" onClick={() => openSearch()}>
          query the corpus <span aria-hidden="true">⌕</span>
        </button>
        <Link to="/" className="u-link t-small">
          Back to the frontispiece <span aria-hidden="true">→</span>
        </Link>
      </div>
      <p className="t-meta text-ink-2 mt-8">
        addresses: {sections.map((s) => `§${s.num}`).join(" · ")}
      </p>
    </div>
  );
}
