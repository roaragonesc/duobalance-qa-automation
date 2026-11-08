import { defineConfig } from '@playwright/test'
import { configureLocal, localApiURL, apiOrigin } from './src/config/localEnvironment'

configureLocal('api')

export default defineConfig({
  testDir: './tests/api',
  testMatch: '*.spec.ts',
  fullyParallel: true,
  timeout: 90_000,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  workers: 1,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report/local-api', open: 'never' }],
    ['junit', { outputFile: 'test-results/local-api/junit.xml' }],
  ],
  outputDir: `test-results/local-api/artifacts-${process.env.DUOBALANCE_API_SHARD ?? 'direct'}`,
  globalTeardown: './src/integration/apiTeardown.ts',
  use: {
    baseURL: localApiURL,
    extraHTTPHeaders: { Origin: apiOrigin },
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'node --import tsx src/integration/runApiServer.ts',
    url: `${localApiURL}health`,
    reuseExistingServer: false,
    timeout: 180_000,
    stdout: 'pipe',
    stderr: 'pipe',
  },
})
