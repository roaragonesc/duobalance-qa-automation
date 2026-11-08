import { defineConfig, devices } from '@playwright/test'
import { frontendURL } from './src/config/environment'

export default defineConfig({
  testDir: './tests/web',
  testMatch: '*.spec.ts',
  fullyParallel: true,
  timeout: 60_000,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  workers: process.env.CI ? 2 : 4,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
  ],
  outputDir: 'test-results/artifacts',
  use: {
    baseURL: frontendURL,
    serviceWorkers: 'block',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
})
