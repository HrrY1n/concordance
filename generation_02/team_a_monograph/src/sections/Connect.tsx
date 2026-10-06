import { Section } from "../components/Section";
import { chapters } from "../content/chapters";
import { site } from "../content/site";
import { links } from "../content/links";

const CHANNELS = ["email", "github", "scholar", "orcid", "linkedin", "rss"] as const;

/** §07 — correspondence. Channels render only as configured; all are null,
 *  so the page shows the restrained placeholder — honest, not apologetic. */
export function ConnectSection() {
  const chapter = chapters.find((c) => c.id === "connect")!;
  return (
    <Section chapter={chapter}>
      <p className="t-lede max-w-[48ch]">{site.connectIntro}</p>
      <ul className="mt-10 border-t border-line-1">
        {CHANNELS.map((channel) => (
          <li
            key={channel}
            className="flex items-baseline justify-between gap-6 border-b border-line-1 py-4"
          >
            <span className="t-label text-ink-2">{channel}</span>
            <span className="t-mono-sm uppercase text-ink-4">
              {links[channel] ?? "— unlisted"}
            </span>
          </li>
        ))}
      </ul>
      <p className="t-body-sm mt-6 text-ink-3">{site.connectEmptyLine}</p>
      <p className="t-serif-voice mt-14 text-[22px] text-ink-2">
        The monograph continues.
      </p>
    </Section>
  );
}
