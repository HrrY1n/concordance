import { useEffect, useState } from "react";

/**
 * Minimal focus + overlay plumbing for the palette, help layer and mobile
 * menu. One overlay state flag on <body> so Esc is never double-spent.
 */

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select, textarea, summary, [tabindex]:not([tabindex="-1"])';

export function trapTab(event: KeyboardEvent, container: HTMLElement | null): void {
  if (!container || event.key !== "Tab") return;
  const nodes = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
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
