import { useEffect } from "react";

const SITE_TITLE = "A Retrievable Self";

/** Route-level document.title + meta description (GEN2_BRIEF SEO requirement). */
export function usePageMeta(title: string, description?: string): void {
  useEffect(() => {
    document.title = title === "home" ? `${SITE_TITLE} — Research Index` : `${title} — ${SITE_TITLE}`;
    if (description) {
      let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
      if (!meta) {
        meta = document.createElement("meta");
        meta.name = "description";
        document.head.appendChild(meta);
      }
      meta.content = description;
    }
  }, [title, description]);
}
