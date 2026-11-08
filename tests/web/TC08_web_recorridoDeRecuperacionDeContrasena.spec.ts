import { expect, test } from '../../src/fixtures'
import testData from '../../src/data/testData/web/TC08_web_recorridoDeRecuperacionDeContrasena.json' with { type: 'json' }
import { defineCaseData } from '../../src/utils/caseData'

const data = defineCaseData(testData)
test.use({ caseData: data.setup })

const ana = data.setup.journeyUsers.a
const newPassword = data.inputs.value

test('TC08_web_recorridoDeRecuperacionDeContrasena', async ({
  anaAccount: _ana,
  loginPage,
  forgotPasswordPage,
  resetPasswordPage,
  onboardingPage,
}) => {
  await test.step('1. El usuario solicita el enlace de recuperación y ve el aviso simulado', async () => {
    await loginPage.openPasswordRecovery()
    await forgotPasswordPage.requestLink(ana.email)
    await expect(forgotPasswordPage.status).toContainText(data.expected.toContainText)
  })

  await test.step('2. El usuario restablece la contraseña y vuelve al login', async () => {
    await forgotPasswordPage.openMockRecoveryLink(ana.email)
    await resetPasswordPage.resetPassword(newPassword)
    await loginPage.expectOpen()
  })

  await test.step('3. El usuario prueba la clave anterior, es rechazada, y entra con la nueva', async () => {
    await loginPage.signIn(ana.email, ana.password)
    await expect(loginPage.alert).toHaveText(data.expected.invalidCredentialsMessage)
    await loginPage.signIn(ana.email, newPassword)
    await onboardingPage.expectOpen()
  })
})
