import { links } from "@/content/links";
import { site } from "@/content/site";
import { useDocumentMeta } from "@/lib/seo";
import { PageShell } from "@/components/structure";
import { sectionByRoute } from "@/lib/sections";
import type { Links } from "@/content/types";

/**
 * §07 CONNECT — action-oriented (§4 / M5). Channels render only when they
 * exist in links.ts; nulls are hidden, never faked. When every channel is
 * null the page says so plainly and keeps ONE explicit mailto slot visible —
 * labeled as the placeholder it is. Value cells break-all so a long address
 * cannot push the row past a 320px screen (P0-7).
 */

const CHANNEL_LABEL: Record<keyof Links, string> = {
  email: "Email",
  github: "GitHub",
  scholar: "Google Scholar",
  orcid: "ORCID",
  linkedin: "LinkedIn",
  rss: "RSS",
};

const CHANNEL_ORDER: (keyof Links)[] = ["email", "github", "scholar", "orcid", "linkedin", "rss"];

export default function ConnectPage() {
  useDocumentMeta(
    "Connect",
    "Correspondence channels. Listed as they exist — nothing staged. While unconfigured, the page says so and keeps one explicit email slot open.",
  );
  const meta = sectionByRoute("/connect")!;

  const present = CHANNEL_ORDER.filter((k) => links[k]);
  const allEmpty = present.length === 0;

  return (
    <PageShell meta={meta} register="plate" lede={site.connectIntro}>
      <div className="max-w-[54rem]">
        <p className="t-h2">
          {site.connectFastest}{" "}
          <span className="t-serif-voice text-ink-2">
            {allEmpty ? "the email slot below." : CHANNEL_LABEL[present[0]].toLowerCase() + "."}
          </span>
        </p>

        {allEmpty ? (
          <p className="t-body text-ink-2 mt-5 max-w-[56ch]">{site.connectEmptyLine}</p>
        ) : null}

        {/* channel rows — only real channels appear */}
        {present.length > 0 ? (
          <ul className="mt-10">
            {present.map((k) => (
              <li key={k} className="border-t border-line">
                <a
                  href={String(links[k])}
                  target={k === "email" ? undefined : "_blank"}
                  rel={k === "email" ? undefined : "noreferrer"}
                  className="group grid min-h-[56px] grid-cols-[8rem_1fr] items-baseline gap-x-6 py-4"
                >
                  <span className="t-meta t-caps text-ink-2">{CHANNEL_LABEL[k]}</span>
                  <span className="t-small text-ink min-w-0 break-all transition-colors group-hover:text-accent">
                    {String(links[k])} <span aria-hidden="true">↗</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          /* the explicit email slot — visible, honest, NOT clickable: a
             mailto to a placeholder address would look like a real contact.
             It becomes a live mailto the moment links.email exists. */
          <ul className="mt-10">
            <li className="border-t border-line">
              <div className="grid min-h-[56px] grid-cols-[8rem_1fr] items-baseline gap-x-6 py-4">
                <span className="t-meta t-caps text-ink-2">Email</span>
                <span className="t-small text-ink-2 min-w-0 break-all">
                  {site.connectUnconfiguredEmail}
                </span>
              </div>
            </li>
            <li className="border-t border-dashed border-line-strong">
              {/* informational row: ink-2, not faint — it carries meaning (P0-11) */}
              <span className="grid min-h-[56px] grid-cols-[8rem_1fr] items-baseline gap-x-6 py-4 text-ink-2">
                <span className="t-meta t-caps">+ 5 slots</span>
                <span className="t-meta t-caps min-w-0 break-words">
                  github · scholar · orcid · linkedin · rss — hidden until configured
                </span>
              </span>
            </li>
          </ul>
        )}

        <p className="t-meta text-ink-2 mt-8 max-w-[62ch]">
          {site.connectMailtoNote}. Nothing on this page pretends to be in touch — a concordance
          only lists what it can cite.
        </p>
      </div>
    </PageShell>
  );
}
