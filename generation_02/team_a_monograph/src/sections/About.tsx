import { Section } from "../components/Section";
import { chapters } from "../content/chapters";
import { aboutEn, aboutNote, profile } from "../content/profile";

/** §01 — Who is writing this. The trailing CJK placeholder sentence doubles
 *  as the site's Chinese-fallback rendering self-check (per GEN2_BRIEF §5). */
export function AboutSection() {
  const chapter = chapters.find((c) => c.id === "about")!;
  return (
    <Section chapter={chapter}>
      <div className="max-w-[660px]">
        <p className="t-mono uppercase text-ink-3">{profile.identity.join(" · ")}</p>
        <p className="t-lede mt-5">{aboutEn}</p>
        {aboutNote && <p className="t-body-sm mt-5 text-ink-3">{aboutNote}</p>}
        <p className="t-body-sm mt-5 text-ink-3">
          No name, no portrait, no affiliation line yet — this monograph is filed
          under its subject, not its author. The identity fields live in{" "}
          <code className="t-mono-sm">src/content/profile.ts</code>.
        </p>
      </div>
    </Section>
  );
}
