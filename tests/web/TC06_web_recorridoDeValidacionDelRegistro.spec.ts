import { expect, test } from '../../src/fixtures'
import { journeyUsers } from '../../src/data/journeyUsers'

const ana = journeyUsers.a

test('TC06_web_recorridoDeValidacionDelRegistro', async ({ registerPage }) => {
  await test.step('1. El usuario registra contraseñas distintas y ve el error sin recibir confirmación', async () => {
    await registerPage.visit()
    await registerPage.register(ana, 'OtraClave123!')
    await expect(registerPage.confirmPasswordField).toHaveAccessibleDescription('Las contraseñas no coinciden.')
    await expect(registerPage.confirmationLink(ana.email)).toHaveCount(0)
  })

  await test.step('2. El usuario corrige la confirmación, reenvía y recibe el enlace de confirmación', async () => {
    await registerPage.confirmPasswordField.fill(ana.password)
    await registerPage.submitButton.click()
    await expect(registerPage.confirmationLink(ana.email)).toBeVisible()
  })
})
