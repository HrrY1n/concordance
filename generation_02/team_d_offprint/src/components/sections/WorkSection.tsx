import { Link } from "react-router-dom";
import { projects } from "../../content/projects";
import { corruptionSandbox } from "../../content/lab";
import { Reveal, SectionHead } from "../../components/chrome";

const STATUS_TEXT: Record<"active" | "maintained" | "archived", string> = {
  active: "Active",
  maintained: "Maintained",
  archived: "Archived",
};

export function WorkSection() {
  return (
    <section id="work" className="section scroll-mt-14">
      <div className="shell">
        <Reveal>
          <SectionHead
            num="02"
            kicker="Selected Work — Case Records"
            title="What these questions look like when built."
            lede="Four case records. Each one says what it does, what it runs on, and where you can act on it — links arrive when they exist, never before."
          />
        </Reveal>

        <ul className="mt-12">
          {projects.map((p, i) => (
            <Reveal key={p.id} delay={Math.min(i * 0.05, 0.2)}>
              <li className="row-hover grid gap-2 border-t border-divider py-8 lg:grid-cols-[minmax(0,60ch)_minmax(0,21ch)] lg:gap-x-16">
                <div className="pl-4 lg:pl-5">
                  <p className="type-mono">
                    W-{String(i + 1).padStart(2, "0")} · {p.year} · {p.kind.toUpperCase()}
                  </p>
                  <h3 className="type-h3 mt-1 text-ink-strong">{p.title}</h3>
                  <p className="type-body mt-2 max-w-[56ch] text-ink-2">{p.summary}</p>
                  <p className="type-mono mt-3 uppercase">
                    ROLE {p.role} · AREAS {p.tags.join(" / ")}
                  </p>

                  {/* Action path — visible without expanding anything */}
                  <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
                    {p.demoRef === corruptionSandbox.id ? (
                      <Link
                        to={corruptionSandbox.path}
                        className="type-mono font-medium text-ink-strong underline decoration-divider-strong underline-offset-4 transition-colors duration-150 hover:decoration-ink"
                      >
                        ▶ TRY IT NOW — {corruptionSandbox.title.toUpperCase()}
                      </Link>
                    ) : null}
                    {p.inPageAction ? (
                      <a
                        href={p.inPageAction.to}
                        className="type-mono font-medium text-ink-strong underline decoration-divider-strong underline-offset-4 transition-colors duration-150 hover:decoration-ink"
                      >
                        → {p.inPageAction.label.toUpperCase()}
                      </a>
                    ) : null}
                    {p.links.github ? (
                      <a href={p.links.github} className="type-mono link-ink">
                        REPO ↗
                      </a>
                    ) : null}
                    {p.links.demo ? (
                      <a href={p.links.demo} className="type-mono link-ink">
                        DEMO ↗
                      </a>
                    ) : null}
                    {p.links.writeup ? (
                      <a href={p.links.writeup} className="type-mono link-ink">
                        WRITEUP ↗
                      </a>
                    ) : null}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pl-4 lg:flex-col lg:items-end lg:justify-start lg:gap-2 lg:pl-0 lg:text-right">
                  {p.status ? (
                    <span className="chip">{STATUS_TEXT[p.status]}</span>
                  ) : null}
                  {p.sample ? null : (
                    <p className="type-mono">NOT A SAMPLE ENTRY</p>
                  )}
                </div>
              </li>
            </Reveal>
          ))}
        </ul>
        <p className="type-mono border-t border-divider pt-3">
          {projects.length} CASE RECORDS — CAPABILITY SHOWN OVER CREDENTIALS CLAIMED
        </p>
      </div>
    </section>
  );
}
