import { useCallback, useEffect, useState } from "react";

/**
 * Tri-state theme (system / light / dark) with localStorage persistence.
 * The inline script in index.html applies the same rules before first paint,
 * so this hook only reads the already-resolved state — no FOUC, no flash.
 */
export type ThemeChoice = "system" | "light" | "dark";

const STORAGE_KEY = "h-theme";
const ORDER: ThemeChoice[] = ["system", "light", "dark"];

function readStored(): ThemeChoice {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw === "light" || raw === "dark" ? raw : "system";
  } catch {
    return "system";
  }
}

function resolve(choice: ThemeChoice): "light" | "dark" {
  if (choice !== "system") return choice;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function apply(choice: ThemeChoice): void {
  const resolved = resolve(choice);
  document.documentElement.classList.toggle("dark", resolved === "dark");
  document.documentElement.style.colorScheme = resolved;
}

export function useTheme(): {
  choice: ThemeChoice;
  resolved: "light" | "dark";
  cycle: () => void;
} {
  const [choice, setChoice] = useState<ThemeChoice>(readStored);
  const [resolved, setResolved] = useState<"light" | "dark">(() => resolve(readStored()));

  // Follow the system while in system mode.
  useEffect(() => {
    apply(choice);
    setResolved(resolve(choice));
    if (choice !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      apply("system");
      setResolved(resolve("system"));
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [choice]);

  const cycle = useCallback(() => {
    setChoice((prev) => {
      const next = ORDER[(ORDER.indexOf(prev) + 1) % ORDER.length];
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        /* storage unavailable — theme still applies for this visit */
      }
      // The one "event": a 240ms color crossfade, skipped under reduced motion.
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!reduce) {
        document.documentElement.classList.add("theme-anim");
        window.setTimeout(() => document.documentElement.classList.remove("theme-anim"), 320);
      }
      return next;
    });
  }, []);

  return { choice, resolved, cycle };
}
