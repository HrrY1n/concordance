import { useEffect } from "react";
import { site } from "@/content/site";

/**
 * Per-route document metadata (GEN3 SEO requirement): title + description +
 * canonical + Open Graph, all routed through one hook. Placeholder fields
 * stay placeholder (site.url is example.com) — nothing is fabricated.
 */

export function useDocumentMeta(title: string, description?: string): void {
  useEffect(() => {
    const fullTitle = title === "" ? site.name : `${title} — ${site.name}`;
    document.title = fullTitle;

    if (description) {
      let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
      if (!meta) {
        meta = document.createElement("meta");
        meta.name = "description";
        document.head.appendChild(meta);
      }
      meta.content = description;
    }

    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (canonical) {
      canonical.href = new URL(window.location.pathname, site.url).href;
    }

    const ogTitle = document.querySelector<HTMLMetaElement>('meta[property="og:title"]');
    if (ogTitle) ogTitle.content = fullTitle;
    if (description) {
      const ogDesc = document.querySelector<HTMLMetaElement>('meta[property="og:description"]');
      if (ogDesc) ogDesc.content = description;
    }
    const ogUrl = document.querySelector<HTMLMetaElement>('meta[property="og:url"]');
    if (ogUrl) ogUrl.content = new URL(window.location.pathname + window.location.search, site.url).href;
  }, [title, description]);
}
