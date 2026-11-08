import { expect, test as base, type Page } from '@playwright/test'
import { DemoPanel } from '../components/DemoPanel'
import { AppNavigation } from '../components/AppNavigation'
import { DemoScenarios } from '../utils/demoScenarios'
import { blockSupabaseRequests } from '../utils/networkGuard'
import { BalancePage } from '../pages/BalancePage'
import { DashboardPage } from '../pages/DashboardPage'
import { ExpensesPage } from '../pages/ExpensesPage'
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage'
import { IncomesPage } from '../pages/IncomesPage'
import { JoinSpacePage } from '../pages/JoinSpacePage'
import { LoginPage } from '../pages/LoginPage'
import { OnboardingPage } from '../pages/OnboardingPage'
import { ProfilePage } from '../pages/ProfilePage'
import { RegisterPage } from '../pages/RegisterPage'
import { ResetPasswordPage } from '../pages/ResetPasswordPage'
import { SpacePage } from '../pages/SpacePage'
import { registerUser, prepareSharedSpace } from '../utils/sharedSpace'
import { journeyUsers } from '../data/journeyUsers'
import { demoExpenses, e2eExpenses } from '../data/expenses'

type E2EFixtures = {
  demoPanel: DemoPanel
  navigation: AppNavigation
  scenarios: DemoScenarios
  loginPage: LoginPage
  registerPage: RegisterPage
  forgotPasswordPage: ForgotPasswordPage
  resetPasswordPage: ResetPasswordPage
  onboardingPage: OnboardingPage
  joinSpacePage: JoinSpacePage
  dashboardPage: DashboardPage
  expensesPage: ExpensesPage
  incomesPage: IncomesPage
  balancePage: BalancePage
  spacePage: SpacePage
  profilePage: ProfilePage
  supabaseRequests: string[]
  resetMockData: void
  partnerPage: Page
  anaAccount: void
  couple: void
  pendingAna: void
  confirmedAna: void
  signedInAna: void
  spaceOwner: void
  recoveryRequested: void
  sharedExpense: void
  privateExpense: void
  sharedAndPrivateExpenses: void
  balancedExpenses: void
  demoSharedExpense: void
  demoPrivateExpense: void
  demoMember: void
}

const requiresRealApiReason =
  'Requiere API real y dos sesiones con datos compartidos; no se puede probar en modo mock (demo de GitHub Pages).'

export const test = base.extend<E2EFixtures>({
  anaAccount: async ({ page, demoPanel, resetMockData: _reset }, provideFixtures) => {
    await registerUser(page, journeyUsers.a)
    await demoPanel.selectUser(null)
    await provideFixtures()
  },
  pendingAna: async ({ registerPage, resetMockData: _reset }, provideFixtures) => {
    await registerPage.visit()
    await registerPage.register(journeyUsers.a)
    await registerPage.confirmationLink(journeyUsers.a.email).waitFor()
    await provideFixtures()
  },
  confirmedAna: async ({ pendingAna: _pending, registerPage, onboardingPage }, provideFixtures) => {
    await registerPage.confirm(journeyUsers.a.email)
    await onboardingPage.expectOpen()
    await provideFixtures()
  },
  signedInAna: async ({ anaAccount: _ana, loginPage, onboardingPage }, provideFixtures) => {
    await loginPage.signIn(journeyUsers.a.email, journeyUsers.a.password)
    await onboardingPage.expectOpen()
    await provideFixtures()
  },
  spaceOwner: async ({ signedInAna: _signedIn, page, onboardingPage }, provideFixtures) => {
    await onboardingPage.createSpace('Hogar E2E', 'equal')
    await page.waitForURL(/\/onboarding\/invite$/)
    await provideFixtures()
  },
  recoveryRequested: async ({ anaAccount: _ana, loginPage, forgotPasswordPage }, provideFixtures) => {
    await loginPage.openPasswordRecovery()
    await forgotPasswordPage.requestLink(journeyUsers.a.email)
    await provideFixtures()
  },
  couple: async ({ page, partnerPage, resetMockData: _reset }, provideFixtures) => {
    await prepareSharedSpace(page, partnerPage)
    await provideFixtures()
  },
  sharedExpense: async ({ couple: _couple, expensesPage }, provideFixtures) => {
    await expensesPage.addExpense(e2eExpenses.supermarket)
    await provideFixtures()
  },
  privateExpense: async ({ couple: _couple, expensesPage }, provideFixtures) => {
    await expensesPage.addExpense(e2eExpenses.hairdresser)
    await provideFixtures()
  },
  sharedAndPrivateExpenses: async ({ sharedExpense: _shared, expensesPage }, provideFixtures) => {
    await expensesPage.addExpense(e2eExpenses.hairdresser)
    await provideFixtures()
  },
  balancedExpenses: async ({ sharedAndPrivateExpenses: _expenses, partnerPage }, provideFixtures) => {
    const partnerExpenses = new ExpensesPage(partnerPage)
    await partnerExpenses.visit()
    await partnerExpenses.addExpense(e2eExpenses.fuel)
    await provideFixtures()
  },
  demoSharedExpense: async ({ demoMember: _member, expensesPage }, provideFixtures) => {
    await expensesPage.visit()
    await expensesPage.addExpense(demoExpenses.shared)
    await provideFixtures()
  },
  demoPrivateExpense: async ({ demoMember: _member, expensesPage }, provideFixtures) => {
    await expensesPage.visit()
    await expensesPage.addExpense(demoExpenses.private)
    await provideFixtures()
  },
  demoMember: async ({ demoPanel, resetMockData: _reset }, provideFixtures) => {
    await demoPanel.selectUser('rocio')
    await provideFixtures()
  },
  partnerPage: async ({ page }, provideFixtures) => {
    test.info().annotations.push({ type: 'bloqueado', description: requiresRealApiReason })
    test.skip(true, requiresRealApiReason)
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
  registerPage: async ({ page }, provideFixtures) => {
    await provideFixtures(new RegisterPage(page))
  },
  forgotPasswordPage: async ({ page }, provideFixtures) => {
    await provideFixtures(new ForgotPasswordPage(page))
  },
  resetPasswordPage: async ({ page }, provideFixtures) => {
    await provideFixtures(new ResetPasswordPage(page))
  },
  navigation: async ({ page }, provideFixtures) => {
    await provideFixtures(new AppNavigation(page))
  },
  onboardingPage: async ({ page }, provideFixtures) => {
    await provideFixtures(new OnboardingPage(page))
  },
  joinSpacePage: async ({ page }, provideFixtures) => {
    await provideFixtures(new JoinSpacePage(page))
  },
  dashboardPage: async ({ page }, provideFixtures) => {
    await provideFixtures(new DashboardPage(page))
  },
  incomesPage: async ({ page }, provideFixtures) => {
    await provideFixtures(new IncomesPage(page))
  },
  balancePage: async ({ page }, provideFixtures) => {
    await provideFixtures(new BalancePage(page))
  },
  spacePage: async ({ page }, provideFixtures) => {
    await provideFixtures(new SpacePage(page))
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
