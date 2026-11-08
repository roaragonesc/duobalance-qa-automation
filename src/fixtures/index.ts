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
import { requiredData, type WebSetup } from '../utils/caseData'

type E2EFixtures = {
  caseData: WebSetup
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
  caseData: [{}, { option: true }],
  anaAccount: async ({ page, demoPanel, caseData, resetMockData: _reset }, provideFixtures) => {
    await registerUser(page, requiredData(caseData.journeyUsers?.a, 'setup.journeyUsers.a'))
    await demoPanel.selectUser(null)
    await provideFixtures()
  },
  pendingAna: async ({ registerPage, caseData, resetMockData: _reset }, provideFixtures) => {
    const ana = requiredData(caseData.journeyUsers?.a, 'setup.journeyUsers.a')
    await registerPage.visit()
    await registerPage.register(ana)
    await registerPage.confirmationLink(ana.email).waitFor()
    await provideFixtures()
  },
  confirmedAna: async ({ pendingAna: _pending, registerPage, onboardingPage, caseData }, provideFixtures) => {
    await registerPage.confirm(requiredData(caseData.journeyUsers?.a, 'setup.journeyUsers.a').email)
    await onboardingPage.expectOpen()
    await provideFixtures()
  },
  signedInAna: async ({ anaAccount: _ana, loginPage, onboardingPage, caseData }, provideFixtures) => {
    const ana = requiredData(caseData.journeyUsers?.a, 'setup.journeyUsers.a')
    await loginPage.signIn(ana.email, ana.password)
    await onboardingPage.expectOpen()
    await provideFixtures()
  },
  spaceOwner: async ({ signedInAna: _signedIn, page, onboardingPage, caseData }, provideFixtures) => {
    const space = requiredData(caseData.space, 'setup.space')
    await onboardingPage.createSpace(space.name, space.splitMethod)
    await page.waitForURL(/\/onboarding\/invite$/)
    await provideFixtures()
  },
  recoveryRequested: async ({ anaAccount: _ana, loginPage, forgotPasswordPage, caseData }, provideFixtures) => {
    await loginPage.openPasswordRecovery()
    await forgotPasswordPage.requestLink(requiredData(caseData.journeyUsers?.a, 'setup.journeyUsers.a').email)
    await provideFixtures()
  },
  couple: async ({ page, partnerPage, caseData, resetMockData: _reset }, provideFixtures) => {
    await prepareSharedSpace(
      page,
      partnerPage,
      requiredData(caseData.journeyUsers?.a, 'setup.journeyUsers.a'),
      requiredData(caseData.journeyUsers?.b, 'setup.journeyUsers.b'),
      requiredData(caseData.space, 'setup.space'),
    )
    await provideFixtures()
  },
  sharedExpense: async ({ couple: _couple, expensesPage, caseData }, provideFixtures) => {
    await expensesPage.addExpense(requiredData(caseData.e2eExpenses?.supermarket, 'setup.e2eExpenses.supermarket'))
    await provideFixtures()
  },
  privateExpense: async ({ couple: _couple, expensesPage, caseData }, provideFixtures) => {
    await expensesPage.addExpense(requiredData(caseData.e2eExpenses?.hairdresser, 'setup.e2eExpenses.hairdresser'))
    await provideFixtures()
  },
  sharedAndPrivateExpenses: async ({ sharedExpense: _shared, expensesPage, caseData }, provideFixtures) => {
    await expensesPage.addExpense(requiredData(caseData.e2eExpenses?.hairdresser, 'setup.e2eExpenses.hairdresser'))
    await provideFixtures()
  },
  balancedExpenses: async ({ sharedAndPrivateExpenses: _expenses, partnerPage, caseData }, provideFixtures) => {
    const partnerExpenses = new ExpensesPage(partnerPage)
    await partnerExpenses.visit()
    await partnerExpenses.addExpense(requiredData(caseData.e2eExpenses?.fuel, 'setup.e2eExpenses.fuel'))
    await provideFixtures()
  },
  demoSharedExpense: async ({ demoMember: _member, expensesPage, caseData }, provideFixtures) => {
    await expensesPage.visit()
    await expensesPage.addExpense(requiredData(caseData.demoExpenses?.shared, 'setup.demoExpenses.shared'))
    await provideFixtures()
  },
  demoPrivateExpense: async ({ demoMember: _member, expensesPage, caseData }, provideFixtures) => {
    await expensesPage.visit()
    await expensesPage.addExpense(requiredData(caseData.demoExpenses?.private, 'setup.demoExpenses.private'))
    await provideFixtures()
  },
  demoMember: async ({ demoPanel, caseData, resetMockData: _reset }, provideFixtures) => {
    await demoPanel.selectUser(requiredData(caseData.demoUser, 'setup.demoUser'))
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
