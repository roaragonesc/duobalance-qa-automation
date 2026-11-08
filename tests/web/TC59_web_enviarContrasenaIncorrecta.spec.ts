import { expect, test } from '../../src/fixtures'
import { journeyUsers } from '../../src/data/journeyUsers'

const ana = journeyUsers.a

test('TC59_web_enviarContrasenaIncorrecta', async ({ anaAccount: _ana, loginPage }) => {
  await loginPage.signIn(ana.email, 'Incorrecta123!')
  await expect(loginPage.emailField).toHaveValue(ana.email)
  await expect(loginPage.alert).toHaveText(loginPage.invalidCredentialsMessage)
})
