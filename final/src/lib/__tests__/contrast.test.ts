import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * G2 guard: every token that carries readable text must reach 4.5:1 (WCAG AA)
 * on --bg, --bg-inset and --raised — in BOTH themes. The hex values are parsed
 * straight out of src/styles/index.css, so the test cannot drift from the
 * stylesheet. --faint is asserted to stay below 4.5:1 to document its
 * decorative-only status.
 */

const CSS_PATH = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "styles", "index.css");

interface ThemeTokens {
  [name: string]: string;
}

function extractBlock(css: string, selector: RegExp): ThemeTokens {
  const start = css.search(selector);
  expect(start, `selector ${selector} not found`).toBeGreaterThan(-1);
  const open = css.indexOf("{", start);
  let depth = 1;
  let end = open;
  while (depth > 0) {
    end++;
    const ch = css[end];
    if (ch === "{") depth++;
    if (ch === "}") depth--;
  }
  const body = css.slice(open + 1, end);
  const tokens: ThemeTokens = {};
  for (const m of body.matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{6})/g)) {
    tokens[m[1]] = m[2];
  }
  return tokens;
}

function luminance(hex: string): number {
  const channels = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const [r, g, b] = channels.map((v) =>
    v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4),
  );
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(fg: string, bg: string): number {
  const l1 = luminance(fg);
  const l2 = luminance(bg);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

const css = readFileSync(CSS_PATH, "utf8");
// Anchored to line starts so `html.dark {` and the prefers-contrast overrides
// (which come later) can never shadow the main token blocks.
const light = extractBlock(css, /^:root \{/m);
const dark = extractBlock(css, /^\.dark \{/m);

const READABLE = ["ink", "ink-2", "accent", "signal", "ok"];
const SURFACES = ["bg", "bg-inset", "raised"];
const THEMES: [string, ThemeTokens][] = [
  ["light", light],
  ["dark", dark],
];

describe("token contrast (G2 — parsed from the stylesheet itself)", () => {
  it("extracts both themes with all tokens present", () => {
    for (const [, tokens] of THEMES) {
      for (const t of [...READABLE, ...SURFACES, "faint"]) {
        expect(tokens[t], `missing token --${t}`).toMatch(/^#[0-9a-fA-F]{6}$/);
      }
    }
  });

  for (const [themeName, tokens] of THEMES) {
    for (const fg of READABLE) {
      for (const bg of SURFACES) {
        it(`${themeName}: ${fg} on ${bg} >= 4.5:1`, () => {
          expect(contrast(tokens[fg], tokens[bg])).toBeGreaterThanOrEqual(4.5);
        });
      }
    }
  }

  it("faint stays decorative (below AA) in both themes — never for readable text", () => {
    expect(contrast(light.faint, light.bg)).toBeLessThan(4.5);
    expect(contrast(dark.faint, dark.bg)).toBeLessThan(4.5);
  });

  it("selection keeps ink readable in both themes", () => {
    expect(contrast(light.ink, light.selection)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(dark.ink, dark.selection)).toBeGreaterThanOrEqual(4.5);
  });
});
