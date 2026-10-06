import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * Production-pass accessibility smoke (P2-3): one pass per core page with
 * axe-core. The gate is the site's own contract — no critical or serious
 * violations (moderate/minor findings are reported to the console for
 * awareness but do not fail; the AA contrast token layer already has its
 * own vitest guard in src/lib/__tests__/contrast.test.ts).
 */

const PAGES: { route: string; marker: string }[] = [
  { route: "/", marker: "Retrieval-augmented generation" },
  // NB: DOM text, not the CSS-uppercased rendering — "Question ledger" is
  // rendered uppercase by .t-kicker but stored lowercase.
  { route: "/research", marker: "Directions are stable; questions move" },
  { route: "/work", marker: "PLATE" },
  { route: "/lab", marker: "instrument" },
  { route: "/about", marker: "About" },
];

for (const { route, marker } of PAGES) {
  test(`a11y smoke: ${route}`, async ({ page }) => {
    await page.goto(route);
    await expect(page.locator("body")).toContainText(marker, { timeout: 15_000 });

    const { violations } = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    const blocking = violations.filter(
      (v) => v.impact === "critical" || v.impact === "serious",
    );
    const advisory = violations.filter((v) => v.impact !== "critical" && v.impact !== "serious");
    if (advisory.length > 0) {
      console.log(
        `[a11y advisory] ${route}:`,
        advisory.map((v) => `${v.id}(${v.impact})×${v.nodes.length}`).join(", "),
      );
    }
    expect(
      blocking.map((v) => `${v.id} (${v.impact}) on ${v.nodes.length} node(s)`),
      `${route} must have no critical/serious axe violations`,
    ).toEqual([]);
  });
}
