import { defineConfig, devices } from '@playwright/test';
import { resolve } from 'node:path';
const workspaceRoot = resolve(__dirname, '../..');

// For CI, you may want to set BASE_URL to the deployed application.
const baseURL = process.env['BASE_URL'] || 'http://localhost:4200';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './src',
  outputDir: './test-output/playwright',
  retries: process.env.CI ? 2 : 0,
  /*
   * The benchmark runs e2e tests strictly one at a time: a single Playwright
   * worker and no intra-file parallelism. Every generated test is padded to
   * E2E_TEST_DURATION_MS (25s) by src/support/pacing.ts, so the timeout must
   * comfortably exceed that.
   */
  workers: 1,
  fullyParallel: false,
  timeout: 90_000,
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    baseURL,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },
  /* Run your local dev server before starting the tests */
  webServer: [
    {
      command: 'npm exec turbo run serve -- --filter=@org/api',
      url: 'http://localhost:3333/api/products',
      reuseExistingServer: !process.env.CI,
      cwd: workspaceRoot,
    },
    {
      command: 'npm exec vite preview -- --config apps/shop/vite.config.mts',
      url: baseURL,
      reuseExistingServer: !process.env.CI,
      cwd: workspaceRoot,
    },
  ],
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Uncomment to test wider variety of browsers
    // Replacing `npx playwright install --only-shell` with `npx playwright install --with-deps`
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    // Uncomment for mobile browsers support
    /* {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    }, */

    // Uncomment for branded browsers
    /* {
      name: 'Microsoft Edge',
      use: { ...devices['Desktop Edge'], channel: 'msedge' },
    },
    {
      name: 'Google Chrome',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    } */
  ],
});
