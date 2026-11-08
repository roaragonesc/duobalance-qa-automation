import { defineConfig, devices } from '@playwright/test'
import { frontendURL, apiURL } from './src/config/environment'

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  timeout: 60_000,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  workers: process.env.CI ? 2 : 4,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report/published', open: 'never' }],
    ['junit', { outputFile: 'test-results/published/junit.xml' }],
  ],
  outputDir: 'test-results/artifacts',
  use: {
    baseURL: frontendURL,
    serviceWorkers: 'block',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      testMatch: '**/web/*.spec.ts',
      testIgnore: '**/web/*_web_e2e_*.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'api',
      testMatch: '**/api/*.spec.ts',
      use: { baseURL: apiURL, extraHTTPHeaders: { Origin: new URL(frontendURL).origin } },
    },
  ],
})
