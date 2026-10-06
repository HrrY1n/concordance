import { createContext, useContext, useMemo, type ReactNode } from "react";

/**
 * Palette context (§4 / M3): any content-bearing surface can open the palette
 * pre-queried. Hero facets, work tags and research keywords all call
 * openSearch(term) — retrieval as a site-wide grammar, not a slogan.
 */
interface PaletteApi {
  openSearch: (initialQuery?: string) => void;
}

const PaletteContext = createContext<PaletteApi | null>(null);

export function PaletteProvider({
  children,
  onOpen,
}: {
  children: ReactNode;
  onOpen: (initialQuery?: string) => void;
}) {
  const api = useMemo<PaletteApi>(() => ({ openSearch: onOpen }), [onOpen]);
  return <PaletteContext.Provider value={api}>{children}</PaletteContext.Provider>;
}

export function useSearch(): PaletteApi {
  const ctx = useContext(PaletteContext);
  if (!ctx) throw new Error("useSearch must be used inside <PaletteProvider>");
  return ctx;
}
