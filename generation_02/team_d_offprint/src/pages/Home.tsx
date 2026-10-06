import { useEffect, useState } from "react";
import { Colophon, ContentsOverlay, Header, HelpOverlay } from "../components/chrome";
import { useDocumentTitle } from "../lib/hooks";
import { Hero } from "../components/sections/Hero";
import { ResearchSection } from "../components/sections/ResearchSection";
import { WorkSection } from "../components/sections/WorkSection";
import { PublicationsSection } from "../components/sections/PublicationsSection";
import { LabSection } from "../components/sections/LabSection";
import { NotesSection } from "../components/sections/NotesSection";
import { AboutSection } from "../components/sections/AboutSection";

export default function Home() {
  useDocumentTitle("Offprint — Grounded answers, studied where they break.");
  const [contentsOpen, setContentsOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "?") return;
      const t = e.target as HTMLElement | null;
      const typing =
        !!t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable);
      if (typing) return;
      e.preventDefault();
      setHelpOpen((v) => !v);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <Header reading onOpenContents={() => setContentsOpen(true)} />
      <main id="main-content" tabIndex={-1} className="focus:outline-none">
        <Hero />
        <ResearchSection />
        <WorkSection />
        <PublicationsSection />
        <LabSection />
        <NotesSection />
        <AboutSection />
      </main>
      <Colophon />
      <ContentsOverlay open={contentsOpen} onClose={() => setContentsOpen(false)} />
      <HelpOverlay open={helpOpen} onClose={() => setHelpOpen(false)} />
    </>
  );
}
