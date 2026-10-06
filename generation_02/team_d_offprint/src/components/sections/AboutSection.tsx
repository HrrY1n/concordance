import { timeline } from "../../content/timeline";
import { links } from "../../content/links";
import { profile } from "../../content/profile";
import { hero } from "../../content/profile";
import { Noted, NoteMark, Reveal, SectionHead } from "../../components/chrome";

const CHANNEL_LABEL: Record<keyof typeof links, string> = {
  email: "Email",
  github: "GitHub",
  scholar: "Scholar",
  orcid: "ORCID",
  linkedin: "LinkedIn",
  rss: "RSS",
};

export function AboutSection() {
  const configured = (Object.keys(links) as (keyof typeof links)[]).filter(
    (k) => links[k] !== null,
  );

  return (
    <section id="about" className="section scroll-mt-14">
      <div className="shell">
        <Reveal>
          <SectionHead
            num="06"
            kicker="About & Connect"
            title="Who is writing this."
          />
        </Reveal>

        <div className="prose mt-10">
          <Reveal>
            <Noted
              n={2}
              note={
                <>
                  The Chinese sentence at the end of this paragraph is deliberate: it
                  stress-tests the serif CJK fallback stack on every device, in every
                  theme.
                </>
              }
            >
              {profile.about}
            </Noted>
          </Reveal>
          <Reveal delay={0.06}>
            <Noted
              n={3}
              note={
                <>
                  This page is a working edition: content lives in typed files, statuses
                  and dates are real working states, and nothing is claimed that cannot be
                  shown.
                </>
              }
            >
              {hero.contactNote} For now the margin note on the title page is the fastest
              way to know what I am thinking about
              <NoteMark n={3} />.
            </Noted>
          </Reveal>
        </div>

        {/* Record — placeholder rows stay ghost, real rows render normally */}
        <div className="mt-14">
          <p className="type-label">RECORD</p>
          <ul className="mt-4">
            {timeline.map((t, i) => {
              const isPlaceholder = t.title.startsWith("TODO");
              return (
                <Reveal key={i} delay={Math.min(i * 0.04, 0.12)}>
                  <li
                    className={`grid gap-1 py-4 lg:grid-cols-[minmax(0,60ch)_minmax(0,21ch)] lg:gap-x-16 ${
                      isPlaceholder ? "ghost-row" : "border-t border-divider"
                    }`}
                  >
                    <p className={isPlaceholder ? "uppercase" : "type-body text-ink"}>
                      {isPlaceholder
                        ? `[ ${t.kind.toUpperCase()} — TO BE WRITTEN ]`
                        : t.title}
                    </p>
                    <p className="type-mono lg:text-right">
                      {t.year}
                      {!isPlaceholder && t.detail ? ` — ${t.detail}` : ""}
                    </p>
                  </li>
                </Reveal>
              );
            })}
          </ul>
        </div>

        {/* Connect — channels appear only as they exist */}
        <div className="mt-14">
          <p className="type-label">CONNECT</p>
          {configured.length === 0 ? (
            <div className="mt-4">
              <p className="type-body text-ink-2">
                No public profiles yet — channels appear here as they exist.
              </p>
              <p className="type-mono mt-3">
                WRITE — {hero.contactNote.toUpperCase()}
              </p>
            </div>
          ) : (
            <ul className="mt-4">
              {configured.map((k) => (
                <li key={k} className="border-t border-divider py-3">
                  <p className="type-mono">
                    {CHANNEL_LABEL[k].toUpperCase()} —{" "}
                    <a href={links[k] as string} className="link-ink">
                      {links[k]}
                    </a>
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
