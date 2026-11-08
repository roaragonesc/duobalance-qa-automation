import { expect, test } from '../../src/fixtures'
import { journeyUsers } from '../../src/data/journeyUsers'

test('TC34_web_registrarYConfirmarAlPrimerUsuario', async ({ registerPage, onboardingPage }) => {
  await registerPage.visit()
  await registerPage.register(journeyUsers.a)
  await expect(registerPage.status).toContainText('Te hemos enviado un correo')
  await registerPage.confirm(journeyUsers.a.email)
  await onboardingPage.expectOpen()
})
