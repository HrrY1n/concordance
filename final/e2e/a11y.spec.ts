import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * 无障碍回归冒烟套件（Accessibility Smoke Suite，中文优先版）。
 * 覆盖全部 11 个一等公民路由，以零 critical / serious 违规作为硬性门槛。
 */

const PAGES: { route: string; marker: string }[] = [
  { route: "/", marker: "检索增强生成" },
  { route: "/research", marker: "研究方向相对稳固" },
  { route: "/work", marker: "PLATE" },
  { route: "/work/item-storage-app", marker: "深度复盘" },
  { route: "/work/soundisle", marker: "深度复盘" },
  { route: "/lab", marker: "实验仪器" },
  { route: "/about", marker: "关于" },
  { route: "/notes", marker: "专为深度静心阅读而排版" },
  { route: "/notes/archive-as-instrument", marker: "档案即仪器" },
  { route: "/publications", marker: "学术成果将在此归档" },
  { route: "/connect", marker: "通讯与公开联络渠道" },
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
