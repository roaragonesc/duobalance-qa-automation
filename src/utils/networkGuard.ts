import type { BrowserContext, Page } from '@playwright/test'
import { frontendURL } from '../config/environment'

// La demo es solo frontend: cualquier peticion fuera de su origen, a REST/Supabase o fetch/XHR es un incumplimiento.
export async function blockSupabaseRequests(page: Page | BrowserContext): Promise<string[]> {
  const requests: string[] = []
  const origin = new URL(frontendURL).origin

  await page.route('**/*', async (route) => {
    const requestUrl = new URL(route.request().url())
    if (
      requestUrl.origin !== origin ||
      /\/(?:__mock|rest\/v1|auth\/v1)(?:\/|$)/.test(requestUrl.pathname) ||
      /\/api(?:\/|$)/.test(requestUrl.pathname) ||
      ['fetch', 'xhr'].includes(route.request().resourceType())
    ) {
      requests.push(requestUrl.toString())
      await route.abort()
      return
    }
    await route.continue()
  })

  return requests
}
