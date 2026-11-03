import { defineConfig } from '@playwright/test'
import { appRoot, configureLocal, localApiURL, mongoURL } from './tests/integration/localEnvironment'

const { database, runDirectory } = configureLocal('api')

export default defineConfig({
  testDir: './tests/api',
  testMatch: '*.spec.ts',
  fullyParallel: true,
  workers: 1,
  retries: 0,
  forbidOnly: true,
  timeout: 30_000,
  globalTeardown: './tests/integration/apiTeardown.ts',
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report/local-api', open: 'never' }],
    ['junit', { outputFile: 'test-results/local-api/junit.xml' }],
  ],
  outputDir: `test-results/local-api/artifacts-${process.env.DUOBALANCE_API_SHARD ?? 'direct'}`,
  use: {
    baseURL: localApiURL,
    extraHTTPHeaders: { Origin: 'http://localhost:5173' },
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'node --import tsx tests/integration/runApiServer.ts',
    url: `${localApiURL}health`,
    reuseExistingServer: false,
    timeout: 180_000,
    env: {
      DUOBALANCE_APP_PATH: appRoot,
      NODE_ENV: 'test', HOST: '127.0.0.1', PORT: '4180',
      FRONTEND_ORIGIN: 'http://localhost:5173',
      MONGODB_URI: mongoURL, MONGODB_DATABASE: database,
      MAIL_DIRECTORY: `${runDirectory}/mail`,
      SEED_TEST_DATA: '0',
    },
  },
})
