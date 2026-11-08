import { defineConfig, devices } from '@playwright/test'
import { appRoot, configureLocal, localApiURL, localFrontendURL, mongoURL } from './src/config/localEnvironment'

const { database, runDirectory } = configureLocal('api-e2e')

export default defineConfig({
  testDir: './tests/web',
  testMatch: '*_web_e2e_*.spec.ts',
  workers: 1,
  retries: 0,
  forbidOnly: true,
  timeout: 90_000,
  globalTeardown: './src/integration/apiTeardown.ts',
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report/local-api-e2e', open: 'never' }],
    ['junit', { outputFile: 'test-results/local-api-e2e/junit.xml' }],
  ],
  outputDir: 'test-results/local-api-e2e/artifacts',
  use: {
    ...devices['Desktop Chrome'],
    baseURL: localFrontendURL,
    serviceWorkers: 'block',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  webServer: [
    {
      command: 'node --import tsx src/integration/runApiServer.ts',
      url: `${localApiURL}health`,
      reuseExistingServer: false,
      timeout: 180_000,
      env: {
        DUOBALANCE_APP_PATH: appRoot,
        NODE_ENV: 'test', HOST: '127.0.0.1', PORT: '4180',
        FRONTEND_ORIGIN: localFrontendURL,
        MONGODB_URI: mongoURL, MONGODB_DATABASE: database,
        MAIL_DIRECTORY: `${runDirectory}/mail`,
        SEED_TEST_DATA: '1',
      },
    },
    {
      command: 'node --import tsx src/integration/runFrontend.ts',
      url: localFrontendURL,
      reuseExistingServer: false,
      env: { VITE_DATA_MODE: 'api', VITE_API_PROXY_TARGET: 'http://127.0.0.1:4180' },
    },
  ],
})
