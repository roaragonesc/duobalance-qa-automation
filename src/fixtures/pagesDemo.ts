import { test as base, expect } from '@playwright/test'
import { blockSupabaseRequests } from '../utils/networkGuard'
import type { WebSetup } from '../utils/caseData'

export const test = base.extend<{ localRequestsOnly: void; caseData: WebSetup }>({
  caseData: [{}, { option: true }],
  localRequestsOnly: [
    async ({ context }, provideFixtures) => {
      const externalRequests = await blockSupabaseRequests(context)
      const sharedRequests: string[] = []
      context.on('request', (request) => {
        if (new URL(request.url()).pathname.startsWith('/__mock/')) {
          sharedRequests.push(request.url())
        }
      })
      await provideFixtures()
      expect(externalRequests).toEqual([])
      expect(sharedRequests).toEqual([])
    },
    { auto: true },
  ],
})

export { expect }
