import { links } from "@/content/publications";
import { profile } from "@/content/profile";
import { site } from "@/content/site";
import { sectionByRoute } from "@/lib/sections";
import { usePageMeta } from "@/lib/seo";
import { PageShell, Section } from "@/components/structure";

const configuredChannels = Object.values(links).filter(Boolean).length;

/** About + Connect. name is null → no invented identity; the work speaks. */
export function AboutContent() {
  return (
    <div className="grid gap-12 lg:grid-cols-12">
      <div className="lg:col-span-7">
        <p className="t-body u-measure">{profile.about}</p>
        {profile.location ? (
          <p className="t-meta text-faint mt-6">{profile.location}</p>
        ) : null}

        <h3 className="t-kicker text-muted mt-12">colophon</h3>
        <p className="t-small text-muted mt-3 max-w-[56ch]">
          Built with Vite, React, and TypeScript. No analytics, no trackers, no cookies beyond
          your theme choice. All content lives in typed files under{" "}
          <span className="font-mono text-[13px]">src/content/</span> — replace the data and the
          site follows. The search index and both Lab demos compute entirely in your browser.
        </p>
        <p className="t-meta t-caps text-faint mt-4">
          retrieval language budget: {site.metaphorTouchpoints.length} touchpoints — hero,
          palette, lab
        </p>
      </div>

      <div className="lg:col-span-4 lg:col-start-9">
        <h3 className="t-kicker text-muted">connect</h3>
        {configuredChannels > 0 ? (
          <ul className="mt-3 space-y-2">
            {links.email ? (
              <li>
                <a href={`mailto:${links.email}`} className="u-link t-small">
                  {links.email}
                </a>
              </li>
            ) : null}
            {links.github ? (
              <li>
                <a href={links.github} className="u-link t-small">
                  GitHub <span aria-hidden="true">↗</span>
                </a>
              </li>
            ) : null}
            {links.scholar ? (
              <li>
                <a href={links.scholar} className="u-link t-small">
                  Google Scholar <span aria-hidden="true">↗</span>
                </a>
              </li>
            ) : null}
            {links.orcid ? (
              <li>
                <a href={links.orcid} className="u-link t-small">
                  ORCID <span aria-hidden="true">↗</span>
                </a>
              </li>
            ) : null}
            {links.linkedin ? (
              <li>
                <a href={links.linkedin} className="u-link t-small">
                  LinkedIn <span aria-hidden="true">↗</span>
                </a>
              </li>
            ) : null}
            {links.rss ? (
              <li>
                <a href={links.rss} className="u-link t-small">
                  RSS <span aria-hidden="true">↗</span>
                </a>
              </li>
            ) : null}
          </ul>
        ) : (
          <>
            <p className="t-small text-muted mt-3">Ways to reach me will appear here.</p>
            <p className="t-meta t-caps text-faint mt-2">status: 0 channels configured</p>
          </>
        )}
      </div>
    </div>
  );
}

export function AboutSection() {
  return (
    <Section
      meta={sectionByRoute("/about")!}
      lede="Who keeps this index — and how it is built."
    >
      <AboutContent />
    </Section>
  );
}

export function AboutPage() {
  usePageMeta("About + Connect");
  return (
    <PageShell meta={sectionByRoute("/about")!} lede="Who keeps this index — and how it is built.">
      <AboutContent />
    </PageShell>
  );
}
