import { expect, test } from '../../src/fixtures'
import { journeyUsers } from '../../src/data/journeyUsers'

const ana = journeyUsers.a

test('TC08_web_corregirYReenviar', async ({ registerPage }) => {
  await registerPage.visit()
  await registerPage.register(ana, 'OtraClave123!')
  await expect(registerPage.confirmPasswordField).toHaveAccessibleDescription('Las contraseñas no coinciden.')

  await registerPage.confirmPasswordField.fill(ana.password)
  await registerPage.submitButton.click()
  await expect(registerPage.confirmationLink(ana.email)).toBeVisible()
})
