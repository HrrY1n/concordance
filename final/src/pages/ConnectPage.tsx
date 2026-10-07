import { useState } from "react";
import { links } from "@/content/links";
import { site } from "@/content/site";
import { useDocumentMeta } from "@/lib/seo";
import { toChannelHref } from "@/lib/contact";
import { PageShell } from "@/components/structure";
import { sectionByRoute } from "@/lib/sections";
import type { Links } from "@/content/types";

/**
 * §07 CONNECT — action-oriented (§4 / M5). Channels render only when they
 * exist in links.ts; nulls are hidden, never faked.
 *
 * Placeholder pass: the all-null state is ONE calm sentence — no slots, no
 * engineering terms, no clickable placeholder address. Email values stay
 * plain strings in content and become mailto: here (lib/contact.ts), with a
 * lightweight copy affordance beside them.
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

function CopyEmailButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      aria-live="polite"
      className="t-meta t-caps text-ink-2 hover:text-ink min-h-[44px] px-2 transition-colors"
      onClick={() => {
        window.navigator.clipboard?.writeText(value).then(
          () => {
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1600);
          },
          () => {
            /* clipboard unavailable — the address is readable right here */
          },
        );
      }}
    >
      {copied ? "copied" : "copy"}
    </button>
  );
}

export default function ConnectPage() {
  useDocumentMeta(
    "Connect",
    "Correspondence channels. Listed as they exist — nothing staged, nothing pretended.",
  );
  const meta = sectionByRoute("/connect")!;

  const present = CHANNEL_ORDER.filter((k) => links[k]);
  const allEmpty = present.length === 0;

  return (
    <PageShell meta={meta} register="plate" lede={site.connectIntro}>
      <div className="max-w-[54rem]">
        {allEmpty ? (
          /* the unconfigured state: one sentence a visitor can read as a
             finished page — no slots, no file paths, no fake address */
          <p className="t-h2 max-w-[30ch]">{site.connectEmptyTitle}</p>
        ) : (
          <>
            <p className="t-h2">
              {site.connectFastest}{" "}
              <span className="t-serif-voice text-ink-2">
                {CHANNEL_LABEL[present[0]].toLowerCase() + "."}
              </span>
            </p>

            {/* channel rows — only real channels appear; email becomes a
                mailto here, at the render layer (content stays plain) */}
            <ul className="mt-10">
              {present.map((k) => {
                const value = String(links[k]);
                const href = toChannelHref(k, value);
                return (
                  <li key={k} className="border-t border-line">
                    {k === "email" ? (
                      <div className="grid min-h-[56px] grid-cols-[8rem_1fr_auto] items-baseline gap-x-6 py-4">
                        <span className="t-meta t-caps text-ink-2">{CHANNEL_LABEL[k]}</span>
                        <a
                          href={href}
                          className="t-small text-ink min-w-0 break-all transition-colors hover:text-accent"
                        >
                          {value} <span aria-hidden="true">↗</span>
                        </a>
                        <CopyEmailButton value={value} />
                      </div>
                    ) : (
                      <a
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        className="group grid min-h-[56px] grid-cols-[8rem_1fr] items-baseline gap-x-6 py-4"
                      >
                        <span className="t-meta t-caps text-ink-2">{CHANNEL_LABEL[k]}</span>
                        <span className="t-small text-ink min-w-0 break-all transition-colors group-hover:text-accent">
                          {value} <span aria-hidden="true">↗</span>
                        </span>
                      </a>
                    )}
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>
    </PageShell>
  );
}
