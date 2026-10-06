import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ScrollManager, SkipLink } from "./components/chrome";
import { ThemeProvider, useTheme } from "./lib/theme";
import Home from "./pages/Home";
import SandboxPage from "./pages/SandboxPage";
import NotFound from "./pages/NotFound";

function isTyping(el: EventTarget | null): boolean {
  const t = el as HTMLElement | null;
  return (
    !!t &&
    (t.tagName === "INPUT" ||
      t.tagName === "TEXTAREA" ||
      t.isContentEditable === true)
  );
}

/** Global keyboard layer: theme cycle lives at app level; the `?` help
 * hotkey lives in Home, which owns the overlay state. */
function KeyboardShortcuts() {
  const { cycle } = useTheme();
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isTyping(e.target) || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "t" || e.key === "T") cycle();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cycle]);
  return null;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/lab/corruption-sandbox" element={<SandboxPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <SkipLink />
        <ScrollManager />
        <KeyboardShortcuts />
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  );
}
