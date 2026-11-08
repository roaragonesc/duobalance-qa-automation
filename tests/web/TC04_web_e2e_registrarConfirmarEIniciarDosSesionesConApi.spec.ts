import { test, expect } from '../../src/fixtures/apiWeb'
import { RegisterPage } from '../../src/pages/RegisterPage'
import { LoginPage } from '../../src/pages/LoginPage'
import { OnboardingPage } from '../../src/pages/OnboardingPage'

test('TC04_web_e2e_registrarConfirmarEIniciarDosSesionesConApi', async ({
  page, partnerPage, users, confirmationUrl,
}) => {
  for (const [actor, user] of [[page, users.a], [partnerPage, users.b]] as const) {
    const register = new RegisterPage(actor)
    const login = new LoginPage(actor)
    await register.visit()
    await register.register(user)
    await expect(register.status).toContainText('Te hemos enviado un correo')
    await register.openConfirmationUrl(await confirmationUrl(user.email))
    await login.expectOpen()
    await login.signIn(user.email, user.password)
    await new OnboardingPage(actor).expectOpen()
  }
})
