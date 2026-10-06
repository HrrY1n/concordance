import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type ThemePref = "system" | "light" | "dark";
export type ResolvedTheme = "light" | "dark";

const STORAGE_KEY = "offprint-theme";
const MEDIA = "(prefers-color-scheme: dark)";

function readPref(): ThemePref {
  if (typeof window === "undefined") return "system";
  const v = window.localStorage.getItem(STORAGE_KEY);
  return v === "light" || v === "dark" || v === "system" ? v : "system";
}

function resolve(pref: ThemePref): ResolvedTheme {
  if (pref !== "system") return pref;
  if (typeof window === "undefined" || !window.matchMedia) return "light";
  return window.matchMedia(MEDIA).matches ? "dark" : "light";
}

function apply(pref: ThemePref): ResolvedTheme {
  const resolved = resolve(pref);
  const root = document.documentElement;
  root.dataset.theme = resolved;
  root.style.colorScheme = resolved;
  return resolved;
}

interface ThemeState {
  pref: ThemePref;
  resolved: ResolvedTheme;
  setPref: (pref: ThemePref) => void;
  cycle: () => void;
}

const ThemeContext = createContext<ThemeState | null>(null);

/**
 * One deliberate "event feel" for the theme switch: a 240ms ink-wash
 * crossfade enabled only while the `theme-fade` class is on <html>.
 * Skipped entirely under prefers-reduced-motion. No View-Transitions
 * circular reveal (flagged as a 2024–26 cliché in the round-1 review).
 */
function playThemeFade() {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const root = document.documentElement;
  root.classList.add("theme-fade");
  window.setTimeout(() => root.classList.remove("theme-fade"), 260);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [pref, setPrefState] = useState<ThemePref>(readPref);
  const [resolved, setResolved] = useState<ResolvedTheme>(() => {
    // index.html's inline script already applied the theme before hydration;
    // read it back so first React render agrees with the DOM.
    if (typeof document === "undefined") return "light";
    const t = document.documentElement.dataset.theme;
    return t === "dark" ? "dark" : "light";
  });

  const setPref = useCallback((next: ThemePref) => {
    window.localStorage.setItem(STORAGE_KEY, next);
    playThemeFade();
    const r = apply(next);
    setPrefState(next);
    setResolved(r);
  }, []);

  const cycle = useCallback(() => {
    setPref(pref === "system" ? "light" : pref === "light" ? "dark" : "system");
  }, [pref, setPref]);

  useEffect(() => {
    // Re-apply on mount (keeps DOM honest if the inline script was absent).
    const r = apply(pref);
    setResolved(r);
    const mq = window.matchMedia(MEDIA);
    const onChange = () => {
      if (pref === "system") setResolved(apply("system"));
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [pref]);

  const value = useMemo(
    () => ({ pref, resolved, setPref, cycle }),
    [pref, resolved, setPref, cycle],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeState {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
