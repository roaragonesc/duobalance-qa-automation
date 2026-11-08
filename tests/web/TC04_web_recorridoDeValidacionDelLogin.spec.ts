import { expect, test } from '../../src/fixtures'
import { journeyUsers } from '../../src/data/journeyUsers'

const ana = journeyUsers.a

test('TC04_web_recorridoDeValidacionDelLogin', async ({ anaAccount: _ana, loginPage, onboardingPage }) => {
  await test.step('1. El usuario envía el formulario vacío y ve los dos errores obligatorios', async () => {
    await expect(loginPage.signInButton).toBeVisible()
    await expect(loginPage.emailField).toHaveValue('')
    await loginPage.submit()
    await expect(loginPage.emailField).toHaveAccessibleDescription('El correo electrónico es obligatorio.')
    await expect(loginPage.passwordField).toHaveAccessibleDescription('La contraseña es obligatoria.')
  })

  await test.step('2. El usuario completa solo el correo y la contraseña se marca como inválida', async () => {
    await loginPage.emailField.fill(ana.email)
    await loginPage.submit()
    await expect(loginPage.passwordField).toHaveAttribute('aria-invalid', 'true')
  })

  await test.step('3. El usuario completa la contraseña y continúa al onboarding', async () => {
    await loginPage.passwordField.fill(ana.password)
    await loginPage.submit()
    await onboardingPage.expectOpen()
    await expect(onboardingPage.heading).toBeVisible()
  })
})
