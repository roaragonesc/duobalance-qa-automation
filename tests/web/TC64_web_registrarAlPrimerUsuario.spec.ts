import { expect, test } from '../../src/fixtures'
import { journeyUsers } from '../../src/data/journeyUsers'

const ana = journeyUsers.a

test('TC64_web_registrarAlPrimerUsuario', async ({ registerPage }) => {
  await registerPage.visit()
  await registerPage.register(ana)
  await expect(registerPage.status).toContainText('Te hemos enviado un correo')
  await expect(registerPage.confirmationLink(ana.email)).toBeVisible()
})
