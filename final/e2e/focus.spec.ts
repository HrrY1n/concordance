import { expect, test } from "@playwright/test";

/**
 * Overlay focus-restore regression suite (Real Content & Cases pass).
 *
 * App.tsx's overlayTrigger remembers the element that opened an overlay and
 * restoreTriggerFocus() hands focus back on close. Two real defects were
 * found by browser verification and are pinned here:
 *   1. the mobile menu opened via a raw setState that skipped rememberTrigger
 *      (Esc restored nothing — focus fell to <body>);
 *   2. the palette/help backdrop dismissed on mousedown without
 *      preventDefault, so the browser's default focus transfer to <body> ran
 *      after restore and wiped it.
 */
test.describe("overlay focus restore", () => {
  test("palette: click open → Esc → trigger refocused", async ({ page }) => {
    await page.goto("/");
    const trigger = page.getByRole("button", { name: /press slash/ }).first();
    await trigger.click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(trigger).toBeFocused();
  });

  test("palette: backdrop mousedown → trigger refocused", async ({ page }) => {
    await page.goto("/");
    const trigger = page.getByRole("button", { name: /press slash/ }).first();
    await trigger.click();
    await expect(page.getByRole("dialog")).toBeVisible();
    // (12,12) is inside the backdrop's padding ring — outside the panel.
    await page.mouse.click(12, 12);
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(trigger).toBeFocused();
  });

  test("mobile menu: open → Esc → trigger refocused", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    const trigger = page.getByRole("button", { name: "Open site index" });
    await trigger.click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(trigger).toBeFocused();
  });

  test("palette: Enter navigation closes overlay and focuses main", async ({ page }) => {
    await page.goto("/");
    const trigger = page.getByRole("button", { name: /press slash/ }).first();
    await trigger.click();
    const input = page.getByRole("combobox");
    await expect(input).toBeFocused();
    await page.keyboard.type("research");
    await page.getByRole("option").first().waitFor();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/research$/);
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(page.locator("#main-content")).toBeFocused();
  });

  test("palette: Chinese keyword search (投毒) and keyboard navigation", async ({ page }) => {
    await page.goto("/");
    const trigger = page.getByRole("button", { name: /press slash/ }).first();
    await trigger.click();
    const input = page.getByRole("combobox");
    await expect(input).toBeFocused();
    await page.keyboard.type("投毒");
    const firstOpt = page.getByRole("option").first();
    await firstOpt.waitFor();
    await expect(firstOpt).toContainText("投毒");
    await page.keyboard.press("Enter");
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(page).toHaveURL(/\/lab\/corruption-sandbox|\/research/);
  });
});
