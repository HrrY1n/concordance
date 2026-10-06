import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { aboutEn } from "../content/profile";
import { researchQuestions } from "../content/research";
import { notes } from "../content/notes";
import { projects } from "../content/projects";
import { publications } from "../content/publications";
import { site } from "../content/site";
import { EASE_SETTLE } from "../lib/motion-tokens";

/**
 * Frontispiece — a paragraph set as an image. Two voices: sans = fact,
 * serif italic = the human qualifier. The orange caret is the site's one
 * standing animation, and it runs only while the hero is in view.
 *
 * The Settle: lines compose top-to-bottom once per session, like type being
 * locked into the forme. reduced-motion / repeat visits → static page.
 */
export function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const reduce = useReducedMotion() ?? false;
  const [settled] = useState(() => {
    try {
      return sessionStorage.getItem("monograph.settled") === "1";
    } catch {
      return false;
    }
  });
  const animateIn = !reduce && !settled;

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
  };
  const line = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.56, ease: EASE_SETTLE } },
  };

  const onAnimationComplete = () => {
    try {
      sessionStorage.setItem("monograph.settled", "1");
    } catch {
      /* ignore */
    }
  };

  const recordCounts =
    `RECORDS — WORK ${projects.length} · NOTES ${notes.length} · ` +
    `PUBS ${publications.length} · QUESTIONS ${researchQuestions.length} · ` +
    `SET ${__BUILD_DATE__}`;

  const rows: ReactNode[] = [
    <p key="eyebrow" className="t-mono uppercase text-ink-3">
      <span
        aria-hidden="true"
        className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-accent align-middle"
      />
      A monograph in progress — {site.heroTag}
    </p>,
    <h1 key="title" className="t-display mt-7">
      <span className="block text-ink-1">{site.heroSans[0]}</span>
      <span className="block text-ink-1">{site.heroSans[1]}</span>
      <span className="t-serif-voice block text-ink-3">
        {site.heroSerif}
        <span aria-hidden="true" className="caret" />
      </span>
    </h1>,
    <p key="lede" className="t-lede mt-8 max-w-[52ch]">
      {aboutEn}
    </p>,
    <div
      key="anchors"
      className="mt-10 flex flex-wrap gap-x-10 gap-y-3 border-t border-line-1 pb-1 pt-4"
    >
      <a
        href="#work"
        className="t-body-sm text-ink-2 underline decoration-line-2 underline-offset-4 transition-colors duration-150 hover:text-ink-1"
      >
        Selected Work ↘
      </a>
      <a
        href="#lab"
        className="t-body-sm text-ink-2 underline decoration-line-2 underline-offset-4 transition-colors duration-150 hover:text-ink-1"
      >
        Lab ↘
      </a>
    </div>,
    <p key="records" className="t-mono-sm mt-7 text-ink-3">
      {recordCounts}
    </p>,
  ];

  return (
    <section
      ref={rootRef}
      id="top"
      data-live={inView ? "true" : "false"}
      aria-label="Frontispiece"
      className="flex min-h-[100svh] items-center pb-16 pt-28"
    >
      <div className="w-full max-w-[1216px] px-6 md:px-12 xl:px-20">
        <div className="max-w-[52rem]">
          {animateIn ? (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              onAnimationComplete={onAnimationComplete}
            >
              {rows.map((row, i) => (
                <motion.div key={i} variants={line}>
                  {row}
                </motion.div>
              ))}
            </motion.div>
          ) : (
            rows
          )}
        </div>
      </div>
    </section>
  );
}
