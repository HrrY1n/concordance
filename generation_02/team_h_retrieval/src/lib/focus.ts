/** Minimal focus management for the three overlays (palette, help, index). */

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

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

/** Mark that a modal layer is open; the hero listens so Esc is never double-spent. */
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
