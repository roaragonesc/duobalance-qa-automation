import { expect, test } from '../../src/fixtures'
import { journeyUsers } from '../../src/data/journeyUsers'

const ana = journeyUsers.a

test('TC57_web_introducirCredencialesValidas', async ({ anaAccount: _ana, loginPage, onboardingPage }) => {
  await expect(loginPage.signInButton).toBeVisible()
  await loginPage.signIn(ana.email, ana.password)
  await onboardingPage.expectOpen()
  await expect(onboardingPage.heading).toBeVisible()
})
