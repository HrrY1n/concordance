import { Link } from "react-router-dom";
import { Header, ThemeControl } from "../components/chrome";
import { useDocumentTitle } from "../lib/hooks";

export default function NotFound() {
  useDocumentTitle("Not found — Offprint");
  return (
    <div className="min-h-screen">
      <Header />
      <main
        id="main-content"
        tabIndex={-1}
        className="shell flex min-h-[70svh] flex-col justify-center pb-24 pt-28 focus:outline-none"
      >
        <p className="type-label">§ — · NOT IN THIS EDITION</p>
        <h1 className="type-h1 mt-4 max-w-[24ch] text-ink-strong">
          The page you asked for is not in the edition.
        </h1>
        <p className="type-lede mt-4 max-w-[52ch]">
          It may have been revised out. The table of contents on the front page is always
          current.
        </p>
        <div className="mt-8">
          <Link to="/" className="type-mono link-ink">
            ← RETURN TO THE FRONT PAGE
          </Link>
        </div>
      </main>
      <footer className="border-t border-divider">
        <div className="shell flex items-baseline justify-between py-6">
          <p className="type-mono">OFFPRINT · WORKING EDITION</p>
          <ThemeControl />
        </div>
      </footer>
    </div>
  );
}
