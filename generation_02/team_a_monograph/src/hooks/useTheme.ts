import { useCallback, useEffect, useMemo, useState } from "react";

export type ThemeMode = "auto" | "light" | "dark";
export const THEME_ORDER: readonly ThemeMode[] = ["auto", "light", "dark"] as const;

const STORAGE_KEY = "monograph.theme";

type VTDocument = Document & {
  startViewTransition?: (updateCallback: () => void) => unknown;
};

function readStoredMode(): ThemeMode {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark" || stored === "auto") return stored;
  } catch {
    /* private mode — fall through */
  }
  return "auto";
}

function systemDark(): boolean {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function resolveMode(mode: ThemeMode): "light" | "dark" {
  if (mode === "auto") return systemDark() ? "dark" : "light";
  return mode;
}

function applyTheme(resolved: "light" | "dark") {
  const root = document.documentElement;
  root.classList.toggle("dark", resolved === "dark");
  root.style.colorScheme = resolved;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", resolved === "dark" ? "#0e1013" : "#fcfcfd");
}

/**
 * Tri-state theme (auto / light / dark) with persistence, no-FOUC support
 * (the inline script in index.html has already applied the class before
 * hydration), and an "event feel" on switch:
 *   L1  View Transitions  → top-to-bottom "re-ink" press wipe
 *   L2  no VT             → staged token crossfade (html.theming window)
 *   L3  reduced motion    → instant swap, no animation
 */
export function useTheme() {
  const [mode, setMode] = useState<ThemeMode>(() => readStoredMode());
  const resolved = useMemo(() => resolveMode(mode), [mode]);

  // Follow the OS while in auto mode.
  useEffect(() => {
    if (mode !== "auto") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyTheme(resolveMode("auto"));
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [mode]);

  const cycle = useCallback(() => {
    setMode((prev) => {
      const next = THEME_ORDER[(THEME_ORDER.indexOf(prev) + 1) % THEME_ORDER.length];
      const resolvedNext = resolveMode(next);
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const doc = document as VTDocument;

      if (!reduce && typeof doc.startViewTransition === "function") {
        doc.startViewTransition(() => applyTheme(resolvedNext));
      } else if (!reduce) {
        const root = document.documentElement;
        root.classList.add("theming");
        applyTheme(resolvedNext);
        window.setTimeout(() => root.classList.remove("theming"), 500);
      } else {
        applyTheme(resolvedNext);
      }

      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  return { mode, resolved, cycle };
}
