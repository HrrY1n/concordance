import { Link } from "react-router-dom";
import { usePageMeta } from "@/lib/seo";

export function NotFoundPage() {
  usePageMeta("Not found");
  return (
    <div className="wrap flex min-h-[60vh] flex-col justify-center pt-24 pb-20">
      <p className="t-meta t-caps text-faint">404 · no document at this address</p>
      <h1 className="t-h1 mt-4 max-w-[24ch]">
        The corpus has no record at this address.
      </h1>
      <p className="t-small text-muted mt-6 max-w-[52ch]">
        The address system covers §01–§06. Everything reachable is listed in the index.
      </p>
      <div className="mt-8">
        <Link to="/" className="u-link t-small">
          Back to the resolved index <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
}
