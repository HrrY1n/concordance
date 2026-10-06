import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { MotionConfig } from "motion/react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HelpOverlay, SearchPalette } from "@/components/SearchPalette";
import { MobileMenu } from "@/components/MobileMenu";
import { Hero } from "@/sections/Hero";
import { ResearchPage, ResearchSection } from "@/sections/Research";
import { WorkPage, WorkSection } from "@/sections/Work";
import { LabPage, LabSection } from "@/sections/Lab";
import { NotesPage, NotesSection } from "@/sections/Notes";
import { PublicationsPage, PublicationsSection } from "@/sections/Publications";
import { AboutPage, AboutSection } from "@/sections/About";
import { NotFoundPage } from "@/pages/NotFound";
import { usePageMeta } from "@/lib/seo";
import { useTheme } from "@/lib/theme";

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.tagName === "SELECT" ||
    target.isContentEditable
  );
}

function ScrollManager(): null {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      // Deep link (e.g. /research#poisoning) — find the anchor after render.
      const el = document.getElementById(hash.slice(1));
      if (el) {
        el.scrollIntoView();
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

function Home() {
  usePageMeta("home");
  return (
    <>
      <Hero />
      <ResearchSection />
      <WorkSection />
      <LabSection />
      <NotesSection />
      <PublicationsSection />
      <AboutSection />
    </>
  );
}

function Shell() {
  const location = useLocation();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { cycle } = useTheme();

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (isTypingTarget(event.target)) return;
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setMenuOpen(false);
        setHelpOpen(false);
        setPaletteOpen((v) => !v);
      } else if (event.key === "/") {
        event.preventDefault();
        setMenuOpen(false);
        setHelpOpen(false);
        setPaletteOpen(true);
      } else if (event.key === "?") {
        event.preventDefault();
        setMenuOpen(false);
        setPaletteOpen(false);
        setHelpOpen(true);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Any route change closes overlays (e.g. after palette navigation).
  useEffect(() => {
    setPaletteOpen(false);
    setHelpOpen(false);
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <ScrollManager />
      <Header
        onOpenPalette={() => {
          setHelpOpen(false);
          setMenuOpen(false);
          setPaletteOpen(true);
        }}
        onOpenMenu={() => setMenuOpen(true)}
      />
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/research" element={<ResearchPage />} />
          <Route path="/work" element={<WorkPage />} />
          <Route path="/lab" element={<LabPage />} />
          <Route path="/notes" element={<NotesPage />} />
          <Route path="/publications" element={<PublicationsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
      <SearchPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onToggleTheme={cycle}
      />
      <HelpOverlay open={helpOpen} onClose={() => setHelpOpen(false)} />
      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onOpenPalette={() => {
          setMenuOpen(false);
          setPaletteOpen(true);
        }}
      />
    </>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <Shell />
      </BrowserRouter>
    </MotionConfig>
  );
}
