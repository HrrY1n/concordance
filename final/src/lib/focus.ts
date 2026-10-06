import { useEffect, useState } from "react";

/**
 * Minimal focus + overlay plumbing for the palette, help layer and mobile
 * menu. One overlay state flag on <body> so Esc is never double-spent.
 */

/**
 * Tab-reachable nodes only. Every element form also excludes
 * `[tabindex="-1"]`: roving-tabindex widgets (the theme radiogroup) mark
 * non-selected buttons tabindex=-1, and if they counted as the trap's "last
 * node" focus could escape the dialog (P0-5).
 */
export const FOCUSABLE_SELECTOR =
  'a[href]:not([tabindex="-1"]), button:not([disabled]):not([tabindex="-1"]), ' +
  'input:not([disabled]):not([tabindex="-1"]), select:not([tabindex="-1"]), ' +
  'textarea:not([tabindex="-1"]), summary:not([tabindex="-1"]), ' +
  '[tabindex]:not([tabindex="-1"])';

export function trapTab(event: KeyboardEvent, container: HTMLElement | null): void {
  if (!container || event.key !== "Tab") return;
  const nodes = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (el) => el.offsetParent !== null || el === document.activeElement,
  );
  if (nodes.length === 0) return;
  const first = nodes[0];
  const last = nodes[nodes.length - 1];
  const active = document.activeElement;
  if (event.shiftKey && active === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && active === last) {
    event.preventDefault();
    first.focus();
  }
}

export function setOverlayOpen(open: boolean): void {
  if (open) document.body.dataset.overlay = "open";
  else delete document.body.dataset.overlay;
}

export function isOverlayOpen(): boolean {
  return document.body.dataset.overlay === "open";
}

export function lockScroll(lock: boolean): void {
  document.documentElement.style.overflow = lock ? "hidden" : "";
}

/** SSR-safe media query hook (sidenote stages, coarse-pointer adjustments). */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}
