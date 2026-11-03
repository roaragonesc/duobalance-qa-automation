import type { BrowserContext, Page } from '@playwright/test'
import { frontendURL } from './environment'
import { localFrontendURL } from '../integration/localEnvironment'

export async function blockSupabaseRequests(page: Page | BrowserContext): Promise<string[]> {
  const requests: string[] = []
  const localApi = process.env.DUOBALANCE_LOCAL_MODE === 'api-e2e'
  const origin = new URL(localApi ? localFrontendURL : frontendURL).origin

  await page.route('**/*', async (route) => {
    const requestUrl = new URL(route.request().url())
    if (requestUrl.origin !== origin ||
        /\/(?:__mock|rest\/v1|auth\/v1)(?:\/|$)/.test(requestUrl.pathname) ||
        (!localApi && (/\/api(?:\/|$)/.test(requestUrl.pathname) ||
          ['fetch', 'xhr'].includes(route.request().resourceType())))) {
      requests.push(requestUrl.toString())
      await route.abort()
      return
    }
    await route.continue()
  })

  return requests
}
