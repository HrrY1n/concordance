import { Suspense, lazy, useCallback, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HelpOverlay, SearchPalette } from "@/components/SearchPalette";
import { MobileMenu } from "@/components/MobileMenu";
import { PaletteProvider } from "@/lib/palette";
import { useTheme } from "@/lib/theme";
import { isOverlayOpen } from "@/lib/focus";

/* Route-level code splitting (§4 / H2): the shell + home ship first; every
   other route is its own chunk fetched on demand. Home stays eager so the
   LCP element is real text in the first chunk. */
import HomePage from "@/pages/HomePage";
const ResearchPage = lazy(() => import("@/pages/ResearchPage"));
const WorkPage = lazy(() => import("@/pages/WorkPage"));
const LabPage = lazy(() => import("@/pages/LabPage"));
const SandboxPage = lazy(() => import("@/pages/SandboxPage"));
const PublicationsPage = lazy(() => import("@/pages/PublicationsPage"));
const NotesPage = lazy(() => import("@/pages/NotesPage"));
const NotePage = lazy(() => import("@/pages/NotePage"));
const AboutPage = lazy(() => import("@/pages/AboutPage"));
const ConnectPage = lazy(() => import("@/pages/ConnectPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));

const SETTLE_KEY = "concordance-settled";

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.tagName === "SELECT" ||
    target.isContentEditable
  );
}

/** Deep-link anchors + route-change reset: scroll top, focus main. */
function ScrollManager(): null {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (el) {
        el.scrollIntoView();
        return;
      }
    }
    window.scrollTo(0, 0);
    document.getElementById("main-content")?.focus({ preventScroll: true });
  }, [pathname, hash]);
  return null;
}

function Shell() {
  const location = useLocation();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [paletteQuery, setPaletteQuery] = useState<string | undefined>(undefined);
  const [helpOpen, setHelpOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { cycle } = useTheme();

  const openPalette = useCallback((initialQuery?: string) => {
    setPaletteQuery(initialQuery);
    setHelpOpen(false);
    setMenuOpen(false);
    setPaletteOpen(true);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (isTypingTarget(event.target)) return;
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        openPalette();
      } else if (event.key === "/") {
        event.preventDefault();
        openPalette();
      } else if (event.key === "?") {
        event.preventDefault();
        setMenuOpen(false);
        setPaletteOpen(false);
        setHelpOpen(true);
      } else if (event.key === "Escape" && !isOverlayOpen()) {
        // Esc outside overlays ends the hero settle, if it is still running.
        try {
          sessionStorage.setItem(SETTLE_KEY, "1");
        } catch {
          /* storage unavailable */
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [openPalette]);

  // Any route change closes overlays (e.g. after palette navigation).
  // Derived reset during render — no cascading effect (react-hooks guidance).
  const [prevPath, setPrevPath] = useState(location.pathname);
  if (prevPath !== location.pathname) {
    setPrevPath(location.pathname);
    setPaletteOpen(false);
    setHelpOpen(false);
    setMenuOpen(false);
  }

  // The hero Settle plays once per session; the flag lands on <html> before
  // first paint so return visits never animate (G1: visible at every frame).
  useEffect(() => {
    try {
      if (sessionStorage.getItem(SETTLE_KEY) === "1") {
        document.documentElement.dataset.settled = "true";
      }
    } catch {
      /* storage unavailable — the settle simply replays */
    }
  }, []);

  return (
    <PaletteProvider onOpen={openPalette}>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <ScrollManager />
      <Header onOpenPalette={() => openPalette()} onOpenMenu={() => setMenuOpen(true)} />
      <main id="main-content" tabIndex={-1} className="pt-16 focus:outline-none">
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/research" element={<ResearchPage />} />
            <Route path="/work" element={<WorkPage />} />
            <Route path="/lab" element={<LabPage />} />
            <Route path="/lab/corruption-sandbox" element={<SandboxPage />} />
            <Route path="/notes" element={<NotesPage />} />
            <Route path="/notes/:slug" element={<NotePage />} />
            <Route path="/publications" element={<PublicationsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/connect" element={<ConnectPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <SearchPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        initialQuery={paletteQuery}
        onToggleTheme={cycle}
      />
      <HelpOverlay open={helpOpen} onClose={() => setHelpOpen(false)} />
      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onOpenPalette={() => openPalette()}
      />
    </PaletteProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Shell />
    </BrowserRouter>
  );
}
