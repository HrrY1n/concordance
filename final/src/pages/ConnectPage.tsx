import { useState } from "react";
import { links } from "@/content/links";
import { site } from "@/content/site";
import { useDocumentMeta } from "@/lib/seo";
import { toChannelHref } from "@/lib/contact";
import { PageShell } from "@/components/structure";
import { sectionByRoute } from "@/lib/sections";
import type { Links } from "@/content/types";

const CHANNEL_LABEL: Record<keyof Links, string> = {
  email: "电子邮箱 (Email)",
  github: "GitHub 个人主页",
  scholar: "Google Scholar 学术主页",
  orcid: "ORCID 学者档案",
  linkedin: "领英 (LinkedIn)",
  rss: "RSS 订阅源",
};

const CHANNEL_ORDER: (keyof Links)[] = ["email", "github", "scholar", "orcid", "linkedin", "rss"];

function CopyEmailButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      aria-live="polite"
      className="t-meta text-ink-2 hover:text-ink min-h-[44px] px-2 transition-colors font-mono text-xs"
      onClick={() => {
        window.navigator.clipboard?.writeText(value).then(
          () => {
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1600);
          },
          () => {
            /* clipboard unavailable */
          },
        );
      }}
    >
      {copied ? "已复制" : "复制"}
    </button>
  );
}

export default function ConnectPage() {
  useDocumentMeta(
    "联络通道",
    "公开通讯与社交主页。所有通道按真实存在呈现 —— 绝不摆设虚假占位。",
  );
  const meta = sectionByRoute("/connect")!;

  const present = CHANNEL_ORDER.filter((k) => links[k]);
  const allEmpty = present.length === 0;

  return (
    <PageShell meta={meta} register="plate" lede={site.connectIntro}>
      <div className="max-w-[54rem]">
        {allEmpty ? (
          <p className="t-h2 max-w-[30ch] font-medium">{site.connectEmptyTitle}</p>
        ) : (
          <>
            <p className="t-h2 font-medium">
              {site.connectFastest}{" "}
              <span className="t-serif-voice text-accent font-normal">
                {CHANNEL_LABEL[present[0]]}。
              </span>
            </p>

            <ul className="mt-10 border-b border-line">
              {present.map((k) => {
                const value = String(links[k]);
                const href = toChannelHref(k, value);
                return (
                  <li key={k} className="border-t border-line">
                    {k === "email" ? (
                      <div className="grid min-h-[56px] grid-cols-[10rem_1fr_auto] items-baseline gap-x-6 py-4">
                        <span className="t-meta text-ink-2 font-mono text-xs">{CHANNEL_LABEL[k]}</span>
                        <a
                          href={href}
                          className="t-small text-ink min-w-0 break-all transition-colors hover:text-accent font-mono"
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
                        className="group grid min-h-[56px] grid-cols-[10rem_1fr] items-baseline gap-x-6 py-4"
                      >
                        <span className="t-meta text-ink-2 font-mono text-xs">{CHANNEL_LABEL[k]}</span>
                        <span className="t-small text-ink min-w-0 break-all transition-colors group-hover:text-accent font-mono">
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
