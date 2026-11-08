import { expect, test } from '../../src/fixtures'

test('TC61_web_enviarFormularioVacio', async ({ anaAccount: _ana, loginPage }) => {
  await expect(loginPage.emailField).toHaveValue('')
  await loginPage.submit()
  await expect(loginPage.emailField).toHaveAccessibleDescription('El correo electrónico es obligatorio.')
  await expect(loginPage.passwordField).toHaveAccessibleDescription('La contraseña es obligatoria.')
})
