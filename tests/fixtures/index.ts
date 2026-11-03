import { expect, test as base, type Page } from '@playwright/test'
import { DemoPanel } from '../components/DemoPanel'
import { DemoScenarios } from '../helpers/demoScenarios'
import { blockSupabaseRequests } from '../helpers/networkGuard'
import { ExpensesPage } from '../pages/ExpensesPage'
import { LoginPage } from '../pages/LoginPage'
import { OnboardingPage } from '../pages/OnboardingPage'
import { ProfilePage } from '../pages/ProfilePage'
import { registerUser, prepareSharedSpace } from '../helpers/sharedSpace'
import { journeyUsers } from '../data/journeyUsers'

type E2EFixtures = {
  demoPanel: DemoPanel
  scenarios: DemoScenarios
  loginPage: LoginPage
  onboardingPage: OnboardingPage
  profilePage: ProfilePage
  expensesPage: ExpensesPage
  supabaseRequests: string[]
  resetMockData: void
  partnerPage: Page
  anaAccount: void
  couple: void
}

export const test = base.extend<E2EFixtures>({
  anaAccount: async ({ page, demoPanel, resetMockData: _reset }, provideFixtures) => {
    await registerUser(page, journeyUsers.a)
    await demoPanel.selectUser(null)
    await provideFixtures()
  },
  couple: async ({ page, partnerPage, resetMockData: _reset }, provideFixtures) => {
    await prepareSharedSpace(page, partnerPage)
    await provideFixtures()
  },
  partnerPage: async ({ page }, provideFixtures) => {
    test.skip(true, 'Bloqueado: Pages no sincroniza datos entre BrowserContexts; requiere backend compartido.')
    await provideFixtures(page)
  },
  supabaseRequests: async ({ context }, provideFixtures) => {
    const requests = await blockSupabaseRequests(context)
    await provideFixtures(requests)
    expect(requests).toEqual([])
  },
  demoPanel: async ({ page }, provideFixtures) => {
    await provideFixtures(new DemoPanel(page))
  },
  loginPage: async ({ page }, provideFixtures) => {
    await provideFixtures(new LoginPage(page))
  },
  onboardingPage: async ({ page }, provideFixtures) => {
    await provideFixtures(new OnboardingPage(page))
  },
  profilePage: async ({ page }, provideFixtures) => {
    await provideFixtures(new ProfilePage(page))
  },
  expensesPage: async ({ page }, provideFixtures) => {
    await provideFixtures(new ExpensesPage(page))
  },
  scenarios: async ({ demoPanel, loginPage, page }, provideFixtures) => {
    await provideFixtures(new DemoScenarios(demoPanel, loginPage, page))
  },
  resetMockData: [
    async ({ page, demoPanel, supabaseRequests: _supabaseRequests }, provideFixtures) => {
      await page.goto('./#/login')
      await demoPanel.resetMockData()
      await provideFixtures()
    },
    { auto: true },
  ],
})

export { expect } from '@playwright/test'
