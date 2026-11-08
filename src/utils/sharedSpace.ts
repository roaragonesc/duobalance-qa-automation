import type { Page } from '@playwright/test'
import { journeyUsers } from '../data/journeyUsers'
import { ExpensesPage } from '../pages/ExpensesPage'
import { JoinSpacePage } from '../pages/JoinSpacePage'
import { OnboardingPage } from '../pages/OnboardingPage'
import { RegisterPage } from '../pages/RegisterPage'

export const journeySpace = 'Hogar E2E'

export async function registerUser(page: Page, user: typeof journeyUsers.a) {
  const registration = new RegisterPage(page)
  await registration.visit()
  await registration.register(user)
  await registration.confirm(user.email)
}

export async function prepareSharedSpace(a: Page, b: Page) {
  await registerUser(a, journeyUsers.a)
  const onboarding = new OnboardingPage(a)
  await onboarding.createSpace(journeySpace, 'equal')
  await onboarding.invite(journeyUsers.b.email)
  const invitation = await onboarding.invitationLink.inputValue()
  await registerUser(b, journeyUsers.b)
  const join = new JoinSpacePage(b)
  await join.open(invitation)
  await join.accept()
  await b.waitForURL((url) => url.hash.split('?')[0].replace(/^#/, '') === '/dashboard')
  const expenses = new ExpensesPage(a)
  await expenses.visit()
  await expenses.heading.waitFor()
}
