import { Link, useParams } from "react-router-dom";
import { caseBySlug, cases, type CaseFigure } from "@/content/cases";
import { useDocumentMeta } from "@/lib/seo";
import { XRef } from "@/components/structure";
import NotFoundPage from "@/pages/NotFoundPage";

/**
 * /work/:slug — the case-study template (Real Content & Cases pass). One
 * template renders every case in content/cases.ts; the register rhythm is
 * PLATE (hero + provenance) → ESSAY (narrative with real captures) → LEDGER
 * (checkable references) → PLATE (next case). Images resolve through
 * BASE_URL so the same build works at "/", "/concordance/" and "./".
 * Unknown slugs render the 404 page inline (same grammar as /notes/:slug).
 */

function FigureRow({ slug, figure }: { slug: string; figure: CaseFigure }) {
  const src = `${import.meta.env.BASE_URL}cases/${slug}/${figure.file}`;
  const img = (
    <img
      src={src}
      alt={figure.alt}
      loading="lazy"
      decoding="async"
      className="block w-full border border-line bg-raised"
    />
  );
  return (
    <figure className={figure.variant === "half" ? "mt-8" : "mt-10"}>
      {figure.variant === "half" ? (
        img /* rendered inside the two-up grid by the caller */
      ) : (
        img
      )}
      <figcaption className="t-meta text-ink-2 mt-2.5 max-w-[62ch]">{figure.caption}</figcaption>
    </figure>
  );
}

export default function CasePage() {
  const { slug } = useParams();
  const cs = caseBySlug(slug);

  useDocumentMeta(
    cs ? `${cs.title} — case study` : "Case not found",
    cs ? cs.summary : "No case study at this address.",
  );

  if (!cs) return <NotFoundPage kind="case" />;

  const idx = cases.findIndex((c) => c.slug === cs.slug);
  const next = cases[(idx + 1) % cases.length];
  const isSoleCase = cases.length < 2;

  return (
    <article className="wrap pb-20 pt-14 md:pt-20" data-register="plate">
      {/* ——— PLATE ——— hero: outcome first */}
      <header className="max-w-[54rem]">
        <p className="t-meta t-caps text-ink-2">
          §02 · case study · {cs.kicker}
        </p>
        <h1 className="t-h1 mt-4">{cs.title}</h1>
        <p className="t-lede text-ink-2 mt-4 max-w-[56ch]">{cs.summary}</p>
        <dl className="t-meta mt-6 grid max-w-[62ch] gap-x-8 gap-y-2 sm:grid-cols-[7rem_1fr]">
          <dt className="t-caps text-ink-2">year</dt>
          <dd className="text-ink-2">{cs.year}</dd>
          <dt className="t-caps text-ink-2">status</dt>
          <dd className="text-ink-2">{cs.status}</dd>
          <dt className="t-caps text-ink-2">role</dt>
          <dd className="text-ink-2">{cs.role}</dd>
          <dt className="t-caps text-ink-2">stack</dt>
          <dd className="flex flex-wrap gap-x-3 gap-y-1 text-ink-2">
            {cs.stack.map((s) => (
              <span key={s}>{s}</span>
            ))}
          </dd>
          <dt className="t-caps text-ink-2">links</dt>
          <dd>
            <XRef to={cs.repoUrl}>repository ↗</XRef>
          </dd>
        </dl>
      </header>

      <figure className="mt-12 border-y border-line py-6">
        <img
          src={`${import.meta.env.BASE_URL}cases/${cs.slug}/${cs.hero.file}`}
          alt={cs.hero.alt}
          decoding="async"
          className="block w-full border border-line bg-raised"
        />
        <figcaption className="mt-3">
          <span className="t-meta t-caps text-ink">HERO — {cs.hero.caption}</span>
          <span className="t-meta text-ink-2 mt-1.5 block max-w-[70ch]">{cs.provenance}</span>
        </figcaption>
      </figure>

      {/* ——— ESSAY ——— narrative sections with real captures between them */}
      <div className="mt-14 max-w-[62rem]" data-register="essay">
        {cs.sections.map((section) => (
          <section key={section.heading} className="border-t border-line py-10 first:border-t-0 first:pt-0">
            <h2 className="t-kicker text-ink-2">{section.heading.toLowerCase()}</h2>
            <div className="u-measure mt-5">
              {section.body.map((para, i) => (
                <p key={i} className="t-body text-ink mt-4 first:mt-0">
                  {para}
                </p>
              ))}
            </div>
            {section.figures && section.figures.length > 0 ? (
              <div className={section.figures.some((f) => f.variant === "half") ? "grid gap-x-8 md:grid-cols-2" : "max-w-[54rem]"}>
                {section.figures.map((f) => (
                  <FigureRow key={f.file} slug={cs.slug} figure={f} />
                ))}
              </div>
            ) : null}
          </section>
        ))}
      </div>

      {/* ——— LEDGER ——— checkable references */}
      <section className="mt-14 border-t border-line pt-8" data-register="ledger" aria-label="References">
        <h2 className="t-kicker text-ink-2">references — every claim above maps to one of these</h2>
        <ul className="mt-5 max-w-[62ch]">
          {cs.references.map((r) => (
            <li key={r.href} className="border-b border-line py-3.5 last:border-b-0">
              <XRef to={r.href}>{r.label}</XRef>
              {r.note ? <span className="t-meta text-ink-2 ml-3">{r.note}</span> : null}
            </li>
          ))}
        </ul>
      </section>

      {/* ——— PLATE ——— next case */}
      {!isSoleCase ? (
        <section className="mt-14 border-t border-line pt-10" data-register="plate" aria-label="Next case study">
          <p className="t-meta t-caps text-ink-2">next case</p>
          <h2 className="t-h2 mt-3">
            <Link to={`/work/${next.slug}`} className="u-link">
              {next.title}
            </Link>
          </h2>
          <p className="t-small text-ink-2 mt-2 max-w-[56ch]">{next.kicker} — {next.summary}</p>
        </section>
      ) : null}
    </article>
  );
}
