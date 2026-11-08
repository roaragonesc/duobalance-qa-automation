import { readdir, readFile, unlink } from 'node:fs/promises'
import { resolve } from 'node:path'
import { randomUUID } from 'node:crypto'
import { test as base, expect, type Page } from '@playwright/test'
import { blockSupabaseRequests } from '../utils/networkGuard'
import { assertDatabase, localFrontendURL, mailDirectory } from '../config/localEnvironment'
import { RegisterPage } from '../pages/RegisterPage'
import { LoginPage } from '../pages/LoginPage'
import { OnboardingPage } from '../pages/OnboardingPage'
import { ExpensesPage } from '../pages/ExpensesPage'
import { JoinSpacePage } from '../pages/JoinSpacePage'

export const test = base.extend<{
  partnerPage: Page
  users: { a: { name: string; email: string; password: string }; b: { name: string; email: string; password: string } }
  confirmationUrl: (email: string) => Promise<string>
  apiNetworkGuard: void
  registeredPair: void
  apiCouple: void
  apiExpenses: { privateUrl: string }
  apiBalanced: void
}>({
  users: async ({ page: _page }, provideFixtures) => {
    const suffix = randomUUID()
    await provideFixtures({
      a: { name: 'Ana', email: `ana-${suffix}@duobalance.test`, password: 'Pruebas1234!' },
      b: { name: 'Luis', email: `luis-${suffix}@duobalance.test`, password: 'Pruebas1234!' },
    })
  },
  apiNetworkGuard: [
    async ({ context, baseURL }, provideFixtures) => {
      base.skip(process.env.DUOBALANCE_LOCAL_MODE !== 'api-e2e',
        'Bloqueado en Pages: ejecutar con playwright.api-e2e.config.ts para frontend y backend aislados.')
      assertDatabase(process.env.DUOBALANCE_API_TEST_DATABASE)
      if (baseURL !== localFrontendURL) throw new Error('El E2E API necesita el entorno aislado en 4176.')
      const requests = await blockSupabaseRequests(context)
      await provideFixtures()
      expect(requests).toEqual([])
    }, { auto: true },
  ],
  partnerPage: async ({ browser, baseURL }, provideFixtures) => {
    const context = await browser.newContext({ baseURL, serviceWorkers: 'block' })
    const requests = await blockSupabaseRequests(context)
    try {
      await provideFixtures(await context.newPage())
      expect(requests).toEqual([])
    } finally { await context.close() }
  },
  confirmationUrl: async ({ baseURL }, provideFixtures) => {
    const directory = mailDirectory()
    const owned = new Set<string>()
    try {
      await provideFixtures(async (email) => {
        for (const filename of await readdir(directory)) {
          const path = resolve(directory, filename)
          const mail = JSON.parse(await readFile(path, 'utf8'))
          if (mail.to === email) {
            owned.add(path)
            const token = typeof mail.text === 'string' ? mail.text.match(/[a-f0-9]{64}/)?.[0] : undefined
            if (token) return `${baseURL}/auth/callback?token_hash=${token}&type=signup`
          }
        }
        throw new Error('No existe el correo de confirmación esperado.')
      })
    } finally { for (const path of owned) await unlink(path) }
  },
  registeredPair: async ({ page, partnerPage, users, confirmationUrl }, provideFixtures) => {
    for (const [actor, user] of [[page, users.a], [partnerPage, users.b]] as const) {
      const register = new RegisterPage(actor)
      await register.visit()
      await register.register(user)
      await register.status.filter({ hasText: 'Te hemos enviado un correo' }).waitFor()
      await register.openConfirmationUrl(await confirmationUrl(user.email))
      await actor.waitForURL(/\/login$/)
      await new LoginPage(actor).signIn(user.email, user.password)
      await actor.waitForURL(/\/onboarding$/)
    }
    await provideFixtures()
  },
  apiCouple: async ({ registeredPair: _registered, page, partnerPage, users }, provideFixtures) => {
    const onboarding = new OnboardingPage(page)
    const partnerJoin = new JoinSpacePage(partnerPage)
    await onboarding.createSpace('Hogar E2E', 'equal')
    await page.waitForURL(/\/onboarding\/invite$/)
    await onboarding.invite(users.b.email)
    await partnerJoin.open(await onboarding.invitationLink.inputValue())
    await partnerJoin.accept()
    await partnerPage.waitForURL(/\/dashboard$/)
    await provideFixtures()
  },
  apiExpenses: async ({ apiCouple: _couple, page }, provideFixtures) => {
    const expenses = new ExpensesPage(page)
    await expenses.visit()
    await expenses.addExpense({ description: 'Supermercado E2E', amount: '80,00' })
    await expenses.addExpense({ description: 'Peluquería E2E', amount: '35,00', individual: true })
    await provideFixtures({ privateUrl: await expenses.editUrl('Peluquería E2E') })
  },
  apiBalanced: async ({ apiExpenses: _expenses, partnerPage }, provideFixtures) => {
    const expenses = new ExpensesPage(partnerPage)
    await expenses.visit()
    await expenses.addExpense({ description: 'Gasolina E2E', amount: '40,00' })
    await provideFixtures()
  },
})
export { expect }
