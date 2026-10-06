import { useLayoutEffect, useRef } from "react";

/**
 * useFlipList — dependency-free FLIP for the sandbox ranking reorder.
 * One layout effect per commit: measure previous positions (stored from the
 * last commit), measure current, invert the delta, play it to zero.
 * Transform-only (G1 discipline); disabled under reduced motion; a no-op
 * whenever nothing actually moved.
 */
export function useFlipList(containerRef: React.RefObject<HTMLElement | null>): void {
  const positions = useRef<Map<string, number>>(new Map());

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const prev = positions.current;
    const next = new Map<string, number>();
    const nodes = Array.from(container.children) as HTMLElement[];

    for (const el of nodes) {
      const key = el.dataset.flipKey;
      if (key) next.set(key, el.getBoundingClientRect().top);
    }
    // Record current geometry BEFORE animating so the next commit compares
    // against the resting layout, not the mid-flight one.
    positions.current = next;

    if (!reduce && prev.size > 0 && nodes.length > 0) {
      for (const el of nodes) {
        const key = el.dataset.flipKey;
        const before = key ? prev.get(key) : undefined;
        const now = key ? next.get(key) : undefined;
        if (before === undefined || now === undefined) continue;
        const dy = before - now;
        if (Math.abs(dy) < 1) continue;
        el.style.transition = "none";
        el.style.transform = `translateY(${dy}px)`;
        void el.offsetHeight; // style flush, then play
        el.style.transition = "transform 280ms cubic-bezier(0.22, 1, 0.36, 1)";
        el.style.transform = "";
      }
      const cleanup = () => {
        for (const el of nodes) {
          el.style.transition = "";
          el.style.transform = "";
        }
      };
      const raf = requestAnimationFrame(() => requestAnimationFrame(cleanup));
      // Cancel path: if the component re-renders mid-flight, drop inline styles.
      return () => cancelAnimationFrame(raf);
    }
  });
}
