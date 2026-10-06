import { hero, profile } from "../../content/profile";
import { researchQuestions, researchTopics } from "../../content/research";
import { Reveal } from "../../components/chrome";

/** The one memorable element: the currently-active question, set as a
 * reviewer's marginal note (朱批) on the title page, with its number
 * ghosted behind the display line. Cinnabar appears here — and only
 * anywhere on the site — to mark "the question being asked right now". */
export function Hero() {
  const active =
    researchQuestions.find((q) => q.status === "active") ?? researchQuestions[0];
  const fields = researchTopics.map((t) => t.short).join(" · ");

  return (
    <section id="top" aria-label="Introduction" className="relative overflow-clip">
      <div className="shell relative">
        <span
          className="ghost-q select-none text-[clamp(9rem,24vw,22rem)]"
          aria-hidden="true"
          style={{ right: "-1rem", top: "3rem" }}
        >
          {active.id.toUpperCase()}
        </span>

        <div className="relative pb-16 pt-24 sm:pt-28 lg:grid lg:min-h-[82svh] lg:grid-cols-[minmax(0,60ch)_minmax(0,21ch)] lg:gap-x-16 lg:pb-24 lg:pt-36">
          <div>
            <p className="type-label">
              OFFPRINT — {hero.edition.toUpperCase()} ·{" "}
              {profile.identity.join(" · ").toUpperCase()}
            </p>
            <Reveal>
              <h1 className="type-display mt-6 text-ink-strong">{hero.stance}</h1>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="type-lede mt-6 max-w-[58ch]">{hero.lede}</p>
            </Reveal>
            <Reveal delay={0.16}>
              <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
                <a href="#research" className="type-mono link-ink">
                  ↓ 01 — THE QUESTION LEDGER
                </a>
                <a href="#work" className="type-mono link-ink">
                  → 02 — SELECTED WORK
                </a>
              </div>
            </Reveal>
          </div>

          {/* Author field — contact lives on the first screen, per round-1 UX review */}
          <div className="mt-12 border-t border-divider pt-6 lg:mt-2 lg:border-t-0 lg:pt-1">
            <div>
              <p className="type-label">FIELDS</p>
              <p className="type-mono mt-2 uppercase">{fields}</p>
            </div>

            <div className="mt-8 border-l-2 border-accent pl-4">
              <p className="type-label text-accent">
                NOW ASKING — {active.id.toUpperCase()}
              </p>
              <p className="type-body mt-2 italic text-ink-2">
                “{active.text}”
              </p>
              <a href="#research" className="type-mono link-quiet mt-3 inline-block">
                → READ THE LEDGER
              </a>
            </div>

            <div className="mt-8">
              <p className="type-label">CONTACT</p>
              <p className="type-mono mt-2">{hero.contactNote.toUpperCase()}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
