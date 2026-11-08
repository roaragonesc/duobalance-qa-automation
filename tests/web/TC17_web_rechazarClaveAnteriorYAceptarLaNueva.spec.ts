import { expect, test } from '../../src/fixtures'
import { journeyUsers } from '../../src/data/journeyUsers'

const ana = journeyUsers.a

test('TC17_web_rechazarClaveAnteriorYAceptarLaNueva', async ({
  recoveryRequested: _requested, loginPage, forgotPasswordPage, resetPasswordPage, onboardingPage,
}) => {
  const password = 'NuevaClave123!'
  await forgotPasswordPage.openMockRecoveryLink(ana.email)
  await resetPasswordPage.resetPassword(password)
  await loginPage.expectOpen()

  await loginPage.signIn(ana.email, ana.password)
  await expect(loginPage.alert).toHaveText(loginPage.invalidCredentialsMessage)
  await loginPage.signIn(ana.email, password)
  await onboardingPage.expectOpen()
})
