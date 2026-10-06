import { projects } from "@/content/projects";
import type { ProjectWithChain } from "@/content/types";
import { sectionByRoute } from "@/lib/sections";
import { usePageMeta } from "@/lib/seo";
import { PageShell, Section } from "@/components/structure";

const pad = (n: number): string => String(n).padStart(2, "0");

/**
 * Evidence chain — Gen 1's praised project grammar, kept but stilled: the
 * 600ms line-draw animation is gone (motion budget), the chain is static
 * typographic structure. Four stations, two audiences:
 *   problem  = one question-shaped sentence for the 90-second scan
 *   method   = verb-first mono lines for the five-minute read
 *   artifacts= only things that exist
 *   links    = only links that exist — the honest "—" otherwise
 */
function ChainArticle({ project, index }: { project: ProjectWithChain; index: number }) {
  const linkEntries = (
    [
      { label: "GitHub", href: project.links.github },
      { label: "Demo", href: project.links.demo },
      { label: "Writeup", href: project.links.writeup },
    ] satisfies { label: string; href: string | null }[]
  ).filter((entry): entry is { label: string; href: string } => Boolean(entry.href));

  return (
    <article className="border-t border-line pt-6" aria-labelledby={`chain-${index}-title`}>
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <span className="t-meta text-faint" aria-hidden="true">
          W-{pad(index + 1)}
        </span>
        <h3 id={`chain-${index}-title`} className="t-small font-medium text-ink">
          {project.title}
        </h3>
        <span className="t-meta t-caps text-faint ml-auto">
          {project.kind} · {project.year} · {project.status ?? "—"}
        </span>
      </div>
      <p className="t-meta text-faint mt-2">{project.tags.join(" · ")}</p>

      <div className="mt-8 grid gap-8 md:grid-cols-12 md:gap-6">
        <div className="md:col-span-5">
          <p className="t-kicker text-faint">01 — problem</p>
          <p className="t-h4 mt-3 max-w-[24ch]">{project.chain.problem}</p>
        </div>

        <div className="md:col-span-3">
          <p className="t-kicker text-faint">02 — method</p>
          <ul className="t-code mt-3 space-y-1">
            {project.chain.method.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-2">
          <p className="t-kicker text-faint">03 — artifacts</p>
          <ul className="t-small text-muted mt-3 space-y-1">
            {project.chain.artifacts.map((artifact) => (
              <li key={artifact}>{artifact}</li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-2">
          <p className="t-kicker text-faint">04 — links</p>
          {linkEntries.length > 0 ? (
            <ul className="mt-3 space-y-1">
              {linkEntries.map(({ label, href }) => (
                <li key={label}>
                  <a href={href} className="u-link t-small">
                    {label} <span aria-hidden="true">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="t-code text-faint mt-3">
              —<span className="sr-only"> no public links configured</span>
            </p>
          )}
        </div>
      </div>
    </article>
  );
}

export function WorkContent() {
  return (
    <div className="space-y-16 md:space-y-20">
      {projects.map((project, i) => (
        <ChainArticle key={project.id} project={project} index={i} />
      ))}
    </div>
  );
}

export function WorkSection() {
  return (
    <Section
      meta={sectionByRoute("/work")!}
      lede="Every project as a chain: a problem, a method, artifacts that exist, links that exist. Nothing else is claimed."
    >
      <WorkContent />
    </Section>
  );
}

export function WorkPage() {
  usePageMeta("Selected Work");
  return (
    <PageShell
      meta={sectionByRoute("/work")!}
      lede="Every project as a chain: a problem, a method, artifacts that exist, links that exist. Nothing else is claimed."
    >
      <WorkContent />
    </PageShell>
  );
}
