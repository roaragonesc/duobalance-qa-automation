import { test, expect } from '../fixtures/apiWeb'
import { RegisterPage } from '../pages/RegisterPage'
import { LoginPage } from '../pages/LoginPage'

test('TC23_registrarConfirmarEIniciarDosSesionesConApi', async ({
  page, partnerPage, users, confirmationUrl,
}) => {
  for (const [actor, user] of [[page, users.a], [partnerPage, users.b]] as const) {
    await actor.goto('/register')
    await new RegisterPage(actor).register(user)
    await expect(actor.getByRole('status')).toContainText('Te hemos enviado un correo')
    await actor.goto(await confirmationUrl(user.email))
    await actor.getByRole('button', { name: 'Confirmar mi correo' }).click()
    await expect(actor).toHaveURL(/\/login$/)
    await new LoginPage(actor).signIn(user.email, user.password)
    await expect(actor).toHaveURL(/\/onboarding$/)
  }
})
