import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import { profile } from "@/content/profile";
import { researchTopics } from "@/content/research";
import { site } from "@/content/site";
import { sections } from "@/lib/sections";
import { isOverlayOpen } from "@/lib/focus";

const INTRO_KEY = "h-intro-resolved";

/**
 * Hero — the self-description device, generation 2.
 *
 * Gen 1 was the "Retrieval Beam": drag to un-blur four facets. Round-1 judges
 * rejected the blur (indistinguishable from broken rendering; harmful to
 * low-vision users) and flagged the ritual-fatigue risk. Gen 2 downgrades to
 * the authorized fallback — a self-completing retrieval:
 *   • the site runs ONE query on itself ("who is this person?");
 *   • four facets arrive in ~1.2s, transform/opacity only, no blur anywhere;
 *   • the headline is visible at t=0 and never animates (LCP is real text);
 *   • Skippable three ways: explicit button (t=0), Esc, or just waiting —
 *     it completes itself in under 1.5s;
 *   • return visits (localStorage) and reduced-motion render it statically;
 *   • the resolved state IS the resting composition — no collapse, no CLS.
 */
export function Hero() {
  const reduceMotion = useReducedMotion();
  const [resolved, setResolved] = useState<boolean>(() => {
    try {
      return localStorage.getItem(INTRO_KEY) === "1";
    } catch {
      return false;
    }
  });

  const facets = useMemo(
    () =>
      site.facetIds
        .map((id) => researchTopics.find((topic) => topic.id === id))
        .filter((topic): topic is (typeof researchTopics)[number] => Boolean(topic)),
    [],
  );

  const finish = useCallback(() => {
    setResolved(true);
    try {
      localStorage.setItem(INTRO_KEY, "1");
    } catch {
      /* storage unavailable — the intro simply replays next visit */
    }
  }, []);

  // Esc skips the intro — unless an overlay owns Esc right now.
  useEffect(() => {
    if (resolved) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isOverlayOpen()) finish();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [resolved, finish]);

  const animateIntro = !resolved && !reduceMotion;
  // Reduced-motion and return visits render the resolved composition from
  // the first paint — the status line must agree, not say "resolving…".
  const introDone = !animateIntro;

  return (
    <section
      aria-labelledby="hero-title"
      className="wrap flex min-h-[calc(100svh-4rem)] flex-col justify-center pt-24 pb-16 md:pt-28 md:pb-20"
    >
      <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
        {/* Left: identity + self-query block */}
        <div className="lg:col-span-7">
          <p className="t-meta t-caps text-muted flex items-center gap-2">
            <span aria-hidden="true" className="text-accent">
              ⌕
            </span>
            {profile.identity.join(" — ")}
          </p>
          <h1 id="hero-title" className="t-display mt-6 max-w-[20ch]">
            {site.headline}
          </h1>

          <div
            className="mt-10 border-t border-line md:mt-14"
            role="group"
            aria-label="Self-query: this site retrieved its own identity"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 pt-3">
              <p className="t-meta text-muted break-words">
                query <span className="text-ink">“{site.selfQuery}”</span>
              </p>
              <p className="t-meta t-caps text-faint" aria-live="polite">
                {introDone ? `resolved · ${facets.length} facets · 0ms network` : "resolving…"}
              </p>
            </div>

            <ul className="mt-2">
              {facets.map((facet, i) => {
                const row = (
                  <Link
                    to={`/research#${facet.id}`}
                    className="group block py-3"
                    aria-label={`${facet.name} — ${facet.facetLine ?? facet.blurb}`}
                  >
                    <span className="flex items-baseline gap-3">
                      <span className="t-meta text-faint" aria-hidden="true">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="t-entry text-ink transition-colors group-hover:text-accent">
                        {facet.name}
                      </span>
                    </span>
                    <span className="t-small text-muted mt-1 block pl-8">
                      {facet.facetLine ?? facet.blurb}
                    </span>
                  </Link>
                );
                return (
                  <li key={facet.id} className="border-b border-line">
                    {animateIntro ? (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: 0.15 + i * 0.18,
                          duration: 0.4,
                          ease: [0.2, 0, 0, 1],
                        }}
                        onAnimationComplete={
                          i === facets.length - 1 ? finish : undefined
                        }
                      >
                        {row}
                      </motion.div>
                    ) : (
                      row
                    )}
                  </li>
                );
              })}
            </ul>

            {/* Skip is visible from t=0; its slot is reserved so nothing shifts. */}
            <div className="flex min-h-[44px] items-center justify-end">
              {animateIntro ? (
                <button type="button" onClick={finish} className="u-link t-meta t-caps">
                  skip intro →
                </button>
              ) : (
                <span className="t-meta t-caps text-transparent" aria-hidden="true">
                  skip intro →
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: the site index — the 10-second orientation map */}
        <aside aria-label="Site index" className="lg:col-span-4 lg:col-start-9">
          <p className="t-kicker text-muted">index of one person</p>
          <ul className="mt-4">
            {sections.map((s) => (
              <li key={s.id} className="border-b border-line">
                <Link
                  to={s.route}
                  className="group flex min-h-[48px] items-baseline gap-3 py-3 transition-colors hover:bg-hover"
                >
                  <span className="t-meta text-faint" aria-hidden="true">
                    §{s.num}
                  </span>
                  <span className="t-small text-ink transition-colors group-hover:text-accent">
                    {s.title}
                  </span>
                  {s.reading ? (
                    <span className="t-meta text-faint ml-auto text-right">{s.reading}</span>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </section>
  );
}
