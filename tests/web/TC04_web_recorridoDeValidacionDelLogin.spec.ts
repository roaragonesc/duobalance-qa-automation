import { expect, test } from '../../src/fixtures'
import testData from '../../src/data/testData/web/TC04_web_recorridoDeValidacionDelLogin.json' with { type: 'json' }
import { defineCaseData } from '../../src/utils/caseData'

const data = defineCaseData(testData)
test.use({ caseData: data.setup })

const ana = data.setup.journeyUsers.a

test('TC04_web_recorridoDeValidacionDelLogin', async ({ anaAccount: _ana, loginPage, onboardingPage }) => {
  await test.step('1. El usuario envía el formulario vacío y ve los dos errores obligatorios', async () => {
    await expect(loginPage.signInButton).toBeVisible()
    await expect(loginPage.emailField).toHaveValue(data.expected.toHaveValue)
    await loginPage.submit()
    await expect(loginPage.emailField).toHaveAccessibleDescription(data.expected.toHaveAccessibleDescription)
    await expect(loginPage.passwordField).toHaveAccessibleDescription(data.expected.toHaveAccessibleDescription1)
  })

  await test.step('2. El usuario completa solo el correo y la contraseña se marca como inválida', async () => {
    await loginPage.emailField.fill(ana.email)
    await loginPage.submit()
    await expect(loginPage.passwordField).toHaveAttribute('aria-invalid', data.expected.toHaveAttribute)
  })

  await test.step('3. El usuario completa la contraseña y continúa al onboarding', async () => {
    await loginPage.passwordField.fill(ana.password)
    await loginPage.submit()
    await onboardingPage.expectOpen()
    await expect(onboardingPage.heading).toBeVisible()
  })
})
