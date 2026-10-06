import { corpusReading } from "@/lib/sections";

declare const __BUILD_DATE__: string;

/** Footer = the colophon. Every number is a real count or a real date. */
export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="wrap py-12 md:py-16">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="t-entry">
              <span aria-hidden="true" className="text-accent">
                ⌕
              </span>{" "}
              A Retrievable Self
            </p>
            <p className="t-small text-muted mt-3 max-w-[52ch]">
              A research index that treats its own content as a corpus. Every section has an
              address; every reading below is counted from the data, not invented.
            </p>
          </div>
          <div className="t-meta t-caps text-faint space-y-2 md:text-right">
            <p>{corpusReading()}</p>
            <p>build {__BUILD_DATE__} · 0 analytics · 0 trackers</p>
            <p>set in newsreader · inter · ibm plex mono</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
