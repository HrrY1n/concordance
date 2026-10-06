import { useEffect, useState } from "react";
import { chapters } from "../content/chapters";

/**
 * Scroll-spy over chapter sections: returns the id of the chapter currently
 * occupying the middle band of the viewport. Drives the running head,
 * nav aria-current and the mobile chapter indicator.
 */
export function useScrollSpy(): string {
  const [current, setCurrent] = useState<string>("top");

  useEffect(() => {
    const sections = chapters
      .map((c) => document.getElementById(c.id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setCurrent(entry.target.id);
        }
      },
      // A horizontal band around the viewport's upper-middle: whichever
      // section crosses it is "the chapter you are reading".
      { rootMargin: "-35% 0px -55% 0px", threshold: 0 },
    );

    for (const el of sections) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return current;
}
