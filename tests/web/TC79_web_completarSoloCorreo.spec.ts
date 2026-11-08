import { expect, test } from '../../src/fixtures'
import { journeyUsers } from '../../src/data/journeyUsers'

test('TC79_web_completarSoloCorreo', async ({ anaAccount: _ana, loginPage }) => {
  await loginPage.emailField.fill(journeyUsers.a.email)
  await loginPage.submit()
  await expect(loginPage.passwordField).toHaveAttribute('aria-invalid', 'true')
})
