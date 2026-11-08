import { expect, test } from '../../src/fixtures'
import { journeyUsers } from '../../src/data/journeyUsers'

test('TC80_web_completarContrasenaYContinuar', async ({
  anaAccount: _ana, loginPage, onboardingPage,
}) => {
  await loginPage.emailField.fill(journeyUsers.a.email)
  await loginPage.passwordField.fill(journeyUsers.a.password)
  await loginPage.submit()
  await onboardingPage.expectOpen()
})
