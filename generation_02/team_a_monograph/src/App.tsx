import { useCallback, useEffect, useRef, useState } from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { IndexOverlay } from "./components/IndexOverlay";
import { SearchDialog } from "./components/SearchDialog";
import { AboutSection } from "./sections/About";
import { ResearchSection } from "./sections/Research";
import { WorkSection } from "./sections/Work";
import { PublicationsSection } from "./sections/Publications";
import { LabSection } from "./sections/Lab";
import { NotesSection } from "./sections/Notes";
import { ConnectSection } from "./sections/Connect";
import { Colophon } from "./sections/Colophon";
import { site } from "./content/site";
import { useScrollSpy } from "./hooks/useScrollSpy";
import { useTheme } from "./hooks/useTheme";

export default function App() {
  const current = useScrollSpy();
  const { mode, cycle } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);
  const [indexOpen, setIndexOpen] = useState(false);
  const searchOpenerRef = useRef<HTMLButtonElement>(null);
  const indexOpenerRef = useRef<HTMLButtonElement>(null);

  const closeSearch = useCallback(() => setSearchOpen(false), []);
  const closeIndex = useCallback(() => setIndexOpen(false), []);

  useEffect(() => {
    document.title = site.title;
  }, []);

  // `/` opens the search (E's steal), except while typing in a field.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);
      if (event.key === "/" && !typing && !searchOpen && !indexOpen) {
        event.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [searchOpen, indexOpen]);

  const navigate = useCallback((target: string) => {
    const el = document.getElementById(target);
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    el.focus({ preventScroll: true });
  }, []);

  return (
    <>
      <a
        href="#main"
        className="t-mono sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:border focus:border-line-2 focus:bg-bg focus:px-4 focus:py-2 focus:text-ink-1 focus:outline-none"
      >
        Skip to content
      </a>

      <Header
        current={current}
        mode={mode}
        onCycleTheme={cycle}
        onOpenSearch={() => setSearchOpen(true)}
        onOpenIndex={() => setIndexOpen(true)}
        searchOpenerRef={searchOpenerRef}
        indexOpenerRef={indexOpenerRef}
      />

      <IndexOverlay
        open={indexOpen}
        onClose={closeIndex}
        current={current}
        returnFocusRef={indexOpenerRef}
      />
      <SearchDialog
        open={searchOpen}
        onClose={closeSearch}
        navigate={navigate}
        returnFocusRef={searchOpenerRef}
      />

      <main id="main">
        <Hero />
        <AboutSection />
        <ResearchSection />
        <WorkSection />
        <PublicationsSection />
        <LabSection />
        <NotesSection />
        <ConnectSection />
      </main>

      <Colophon />
    </>
  );
}
