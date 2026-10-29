import { defineConfig } from "@playwright/test";

/**
 * Accessibility smoke suite: 11 pages (all routes incl. case studies and a
 * note detail) plus the overlay focus-restore regression suite, against
 * the regular production build (base "/"), served by `vite preview`. Run via
 * `npm run test:a11y`. The Chromium binary is shared with the repo's existing
 * Playwright install — no extra browser download.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  retries: 0,
  use: {
    baseURL: "http://localhost:4199",
    viewport: { width: 1280, height: 800 },
  },
  webServer: {
    command: "npx vite preview --port 4199 --strictPort",
    url: "http://localhost:4199/",
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
