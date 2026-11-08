import { expect, test } from '../../src/fixtures'
import { journeyUsers } from '../../src/data/journeyUsers'

const ana = journeyUsers.a

test('TC07_web_enviarContrasenasDiferentes', async ({ registerPage }) => {
  await registerPage.visit()
  await registerPage.register(ana, 'OtraClave123!')
  await expect(registerPage.confirmPasswordField).toHaveAccessibleDescription('Las contraseñas no coinciden.')
  await expect(registerPage.confirmationLink(ana.email)).toHaveCount(0)
})
