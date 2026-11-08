import { expect, test } from '../../src/fixtures/pagesDemo'
import { DemoPanel } from '../../src/components/DemoPanel'
import { frontendURL } from '../../src/config/environment'
import { ForgotPasswordPage } from '../../src/pages/ForgotPasswordPage'
import { LoginPage } from '../../src/pages/LoginPage'
import { RegisterPage } from '../../src/pages/RegisterPage'
import { ResetPasswordPage } from '../../src/pages/ResetPasswordPage'

test('TC03_web_confirmarYRecuperarUnaCuentaEnLaDemoEstatica', async ({ page }) => {
  const email = 'pages@example.test'
  const demoPanel = new DemoPanel(page)
  const register = new RegisterPage(page)
  const login = new LoginPage(page)
  const forgotPassword = new ForgotPasswordPage(page)
  const resetPassword = new ResetPasswordPage(page)
  await register.visit()
  await demoPanel.hideButton.click()
  await register.register({ name: 'Demo Pages', email, password: 'Pruebas1234!' })
  await demoPanel.showButton.click()
  const confirmation = register.confirmationLink(email)
  await expect(confirmation).toHaveAttribute('href', /#\/auth\/callback\?token_hash=/)
  await confirmation.click()
  await demoPanel.hideButton.click()
  await register.confirmEmailButton.click()
  await expect(page).toHaveURL(new URL('./#/onboarding', frontendURL).href)
  await demoPanel.showButton.click()
  await demoPanel.selectUser(null)
  await expect(page).toHaveURL(new URL('./#/login', frontendURL).href)
  await demoPanel.hideButton.click()
  await login.openPasswordRecovery()
  await expect(forgotPassword.heading).toBeVisible()
  await forgotPassword.emailField.fill(email)
  await expect(forgotPassword.emailField).toHaveValue(email)
  await forgotPassword.sendLinkButton.click()
  await expect(forgotPassword.status).toContainText('Si existe una cuenta con ese correo')
  await demoPanel.showButton.click()
  await Promise.all([page.waitForEvent('domcontentloaded'), forgotPassword.openMockRecoveryLink(email)])
  await expect(page).toHaveURL(/#\/reset-password\?mock_token=/)
  await expect(resetPassword.passwordField).toBeVisible()
})
