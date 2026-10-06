import { useSyncExternalStore } from "react";

/**
 * Tri-state theme (system / light / dark), localStorage-persisted, no FOUC:
 * the inline script in index.html applies the same rules before first paint,
 * so this module only reads the already-resolved state.
 *
 * SINGLE SOURCE OF TRUTH (P0-4): the choice lives in this module-level store,
 * not in per-component useState. Header's toggle, MobileMenu's radiogroup and
 * the palette's cycle action all subscribe through useSyncExternalStore, so
 * four instances can never drift apart and an OS-level system-theme change
 * re-derives ONE resolved value. The pure helpers stay exported for tests.
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

/** The one decision both index.html and this store must agree on. */
export function resolveTheme(choice: ThemeChoice, systemDark: boolean): Resolved {
  if (choice !== "system") return choice;
  return systemDark ? "dark" : "light";
}

export function nextChoice(choice: ThemeChoice): ThemeChoice {
  return THEME_ORDER[(THEME_ORDER.indexOf(choice) + 1) % THEME_ORDER.length];
}

/* ------------------------------ module store ------------------------------ */

export interface ThemeSnapshot {
  choice: ThemeChoice;
  resolved: Resolved;
}

const listeners = new Set<() => void>();
let initialized = false;
let systemDark = false;
let snapshot: ThemeSnapshot = { choice: "system", resolved: "light" };

function apply(resolved: Resolved): void {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", resolved === "dark");
  document.documentElement.style.colorScheme = resolved;
}

function emit(): void {
  for (const listener of listeners) listener();
}

/** Runs once, lazily — including in the browser before React mounts anything. */
function init(): void {
  if (initialized || typeof window === "undefined") return;
  initialized = true;
  systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const choice = readStoredChoice(typeof localStorage === "undefined" ? null : localStorage);
  snapshot = { choice, resolved: resolveTheme(choice, systemDark) };
  apply(snapshot.resolved);
  // The system preference is external state; the store subscribes to it once.
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (event) => {
    systemDark = event.matches;
    const resolved = resolveTheme(snapshot.choice, systemDark);
    if (resolved !== snapshot.resolved) {
      snapshot = { ...snapshot, resolved };
      apply(resolved);
      emit();
    }
  });
}

export function subscribeTheme(listener: () => void): () => void {
  init();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getThemeSnapshot(): ThemeSnapshot {
  init();
  return snapshot;
}

/** The one standing theme "event" (240ms re-ink), skipped under reduced motion. */
function reInk(): void {
  if (typeof window === "undefined") return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduce && typeof document !== "undefined") {
    document.documentElement.classList.add("theme-anim");
    window.setTimeout(() => document.documentElement.classList.remove("theme-anim"), 320);
  }
}

export function setThemeChoice(next: ThemeChoice): void {
  init();
  try {
    localStorage.setItem(THEME_STORAGE_KEY, next);
  } catch {
    /* storage unavailable — theme still applies for this visit */
  }
  reInk();
  const resolved = resolveTheme(next, systemDark);
  if (next !== snapshot.choice || resolved !== snapshot.resolved) {
    snapshot = { choice: next, resolved };
    apply(resolved);
    emit();
  }
}

export function cycleTheme(): void {
  setThemeChoice(nextChoice(getThemeSnapshot().choice));
}

/** Test-only reset so each test starts from the default state. */
export function __resetThemeStore(): void {
  initialized = false;
  listeners.clear();
  snapshot = { choice: "system", resolved: "light" };
}

/* --------------------------------- hook ----------------------------------- */

export function useTheme(): {
  choice: ThemeChoice;
  resolved: Resolved;
  cycle: () => void;
  setChoice: (choice: ThemeChoice) => void;
} {
  const snap = useSyncExternalStore(subscribeTheme, getThemeSnapshot);
  return { choice: snap.choice, resolved: snap.resolved, cycle: cycleTheme, setChoice: setThemeChoice };
}
