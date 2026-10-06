import { Link } from "react-router-dom";
import { labInstruments, sandboxHonesty } from "../../content/lab";
import { Reveal, SectionHead } from "../../components/chrome";

export function LabSection() {
  return (
    <section id="lab" className="section scroll-mt-14">
      <div className="shell">
        <Reveal>
          <SectionHead
            num="04"
            kicker="Appendix — Runs Locally"
            title="The runnable part."
            lede="Small offline instruments for the questions above. No backend, no model calls, no network — every number is computed in your browser."
          />
        </Reveal>

        <ul className="mt-12">
          {labInstruments.map((l, i) => {
            return (
              <Reveal key={l.id} delay={Math.min(i * 0.05, 0.15)}>
                <li className="row-hover grid gap-3 border-t border-divider py-8 lg:grid-cols-[minmax(0,60ch)_minmax(0,21ch)] lg:gap-x-16">
                  <div className="pl-4 lg:pl-5">
                    <p className="type-mono">{l.index}</p>
                    <h3 className="type-h3 mt-1 text-ink-strong">{l.title}</h3>
                    <p className="type-body mt-2 max-w-[56ch] text-ink-2">{l.blurb}</p>
                    <p className="type-mono mt-3 uppercase">
                      RE: {l.reQuestions.map((q) => q.toUpperCase()).join(" · ")} ·{" "}
                      {l.method.toUpperCase()}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 pl-4 lg:flex-col lg:items-end lg:gap-3 lg:pl-0 lg:text-right">
                    <span className="chip">{l.runtime}</span>
                    <Link
                      to={l.path}
                      className="type-mono font-medium text-ink-strong underline decoration-divider-strong underline-offset-4 transition-colors duration-150 hover:decoration-ink"
                    >
                      OPEN THE SANDBOX →
                    </Link>
                  </div>
                </li>
              </Reveal>
            );
          })}
        </ul>

        <p className="type-note mt-6 max-w-[60ch] border-l-2 border-divider-strong pl-4">
          {sandboxHonesty}
        </p>
      </div>
    </section>
  );
}
