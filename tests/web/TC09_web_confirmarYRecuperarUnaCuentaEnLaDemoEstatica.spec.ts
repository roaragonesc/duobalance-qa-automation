import { expect, test } from '../../src/fixtures/pagesDemo'
import { DemoPanel } from '../../src/components/DemoPanel'
import { frontendURL } from '../../src/config/environment'
import { ForgotPasswordPage } from '../../src/pages/ForgotPasswordPage'
import { LoginPage } from '../../src/pages/LoginPage'
import { RegisterPage } from '../../src/pages/RegisterPage'
import { ResetPasswordPage } from '../../src/pages/ResetPasswordPage'

test('TC09_web_confirmarYRecuperarUnaCuentaEnLaDemoEstatica', async ({ page }) => {
  const email = 'pages@example.test'
  const demoPanel = new DemoPanel(page)
  const register = new RegisterPage(page)
  const login = new LoginPage(page)
  const forgotPassword = new ForgotPasswordPage(page)
  const resetPassword = new ResetPasswordPage(page)

  await test.step('1. El usuario se registra con el panel mock oculto y recibe el enlace de confirmación', async () => {
    await register.visit()
    await demoPanel.hideButton.click()
    await register.register({ name: 'Demo Pages', email, password: 'Pruebas1234!' })
    await demoPanel.showButton.click()
    await expect(register.confirmationLink(email)).toHaveAttribute('href', /#\/auth\/callback\?token_hash=/)
  })

  await test.step('2. El usuario abre el enlace, confirma el correo y llega al onboarding', async () => {
    await register.confirmationLink(email).click()
    await demoPanel.hideButton.click()
    await register.confirmEmailButton.click()
    await expect(page).toHaveURL(new URL('./#/onboarding', frontendURL).href)
  })

  await test.step('3. El usuario cierra la sesión simulada y vuelve al login', async () => {
    await demoPanel.showButton.click()
    await demoPanel.selectUser(null)
    await expect(page).toHaveURL(new URL('./#/login', frontendURL).href)
  })

  await test.step('4. El usuario solicita la recuperación de contraseña y ve el aviso simulado', async () => {
    await demoPanel.hideButton.click()
    await login.openPasswordRecovery()
    await expect(forgotPassword.heading).toBeVisible()
    await forgotPassword.emailField.fill(email)
    await expect(forgotPassword.emailField).toHaveValue(email)
    await forgotPassword.sendLinkButton.click()
    await expect(forgotPassword.status).toContainText('Si existe una cuenta con ese correo')
  })

  await test.step('5. El usuario abre el enlace de recuperación y llega al formulario de nueva contraseña', async () => {
    await demoPanel.showButton.click()
    await forgotPassword.openMockRecoveryLink(email)
    await expect(page).toHaveURL(/#\/reset-password\?mock_token=/)
    await expect(resetPassword.passwordField).toBeVisible()
  })
})
