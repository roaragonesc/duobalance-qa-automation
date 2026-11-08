import { expect, test } from '../../src/fixtures'
import { journeyUsers } from '../../src/data/journeyUsers'

test('TC16_web_restablecerContrasena', async ({
  recoveryRequested: _requested, loginPage, forgotPasswordPage, resetPasswordPage,
}) => {
  await forgotPasswordPage.openMockRecoveryLink(journeyUsers.a.email)
  await resetPasswordPage.resetPassword('NuevaClave123!')
  await loginPage.expectOpen()
})
