import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Tri-state theme (system / light / dark), localStorage-persisted, no FOUC:
 * the inline script in index.html applies the same rules before first paint,
 * so this hook only reads the already-resolved state. The pure helpers are
 * exported for tests (theme.test.ts).
 */

export type ThemeChoice = "system" | "light" | "dark";
export type Resolved = "light" | "dark";

export const THEME_STORAGE_KEY = "concordance-theme";
export const THEME_ORDER: readonly ThemeChoice[] = ["system", "light", "dark"];

export function readStoredChoice(store: Pick<Storage, "getItem"> | null): ThemeChoice {
  try {
    const raw = store?.getItem(THEME_STORAGE_KEY);
    return raw === "light" || raw === "dark" ? raw : "system";
  } catch {
    return "system";
  }
}

/** The one decision both index.html and this hook must agree on. */
export function resolveTheme(choice: ThemeChoice, systemDark: boolean): Resolved {
  if (choice !== "system") return choice;
  return systemDark ? "dark" : "light";
}

export function nextChoice(choice: ThemeChoice): ThemeChoice {
  return THEME_ORDER[(THEME_ORDER.indexOf(choice) + 1) % THEME_ORDER.length];
}

function apply(resolved: Resolved): void {
  document.documentElement.classList.toggle("dark", resolved === "dark");
  document.documentElement.style.colorScheme = resolved;
}

export function useTheme(): {
  choice: ThemeChoice;
  resolved: Resolved;
  cycle: () => void;
  setChoice: (choice: ThemeChoice) => void;
} {
  const [choice, setChoiceState] = useState<ThemeChoice>(() =>
    readStoredChoice(typeof localStorage === "undefined" ? null : localStorage),
  );

  // The system preference is external state; React subscribes to it.
  const [systemDark, setSystemDark] = useState(
    () => window.matchMedia("(prefers-color-scheme: dark)").matches,
  );
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => setSystemDark(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Derived during render — the one decision, applied as an external update.
  const resolved = resolveTheme(choice, systemDark);
  useEffect(() => {
    apply(resolved);
  }, [resolved]);

  // Keep a ref in sync via effect (never during render) so cycle() can read
  // the current choice without a cascading update.
  const choiceRef = useRef(choice);
  useEffect(() => {
    choiceRef.current = choice;
  }, [choice]);

  // Persisting the choice writes an external system; the re-ink is the one
  // standing theme "event", skipped under reduced motion.
  const commit = useCallback((next: ThemeChoice) => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      /* storage unavailable — theme still applies for this visit */
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduce) {
      document.documentElement.classList.add("theme-anim");
      window.setTimeout(() => document.documentElement.classList.remove("theme-anim"), 320);
    }
  }, []);

  const setChoice = useCallback(
    (next: ThemeChoice) => {
      setChoiceState(next);
      commit(next);
    },
    [commit],
  );

  const cycle = useCallback(() => {
    setChoice(nextChoice(choiceRef.current));
  }, [setChoice]);

  return { choice, resolved, cycle, setChoice };
}
