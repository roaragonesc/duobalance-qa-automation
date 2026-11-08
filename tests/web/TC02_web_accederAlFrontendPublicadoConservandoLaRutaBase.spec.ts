import { expect, test } from '../../src/fixtures/pagesDemo'
import { DemoPanel } from '../../src/components/DemoPanel'
import { frontendURL } from '../../src/config/environment'
import { LoginPage } from '../../src/pages/LoginPage'
import { RegisterPage } from '../../src/pages/RegisterPage'

test('TC02_web_accederAlFrontendPublicadoConservandoLaRutaBase', async ({ page }) => {
  const login = new LoginPage(page)
  const register = new RegisterPage(page)

  await test.step('1. El usuario abre la URL publicada y llega al login conservando la ruta base', async () => {
    const response = await login.visitRoot()
    expect(response?.status()).toBe(200)
    await expect(page).toHaveURL(new URL('./#/login', frontendURL).href)
    await expect(login.heading).toBeVisible()
    await expect(new DemoPanel(page).panel).toContainText('No se sincroniza entre dispositivos.')
  })

  await test.step('2. El usuario navega al registro desde el login', async () => {
    await login.registerLink.click()
    await expect(page).toHaveURL(new URL('./#/register', frontendURL).href)
    await expect(register.submitButton).toBeVisible()
  })
})
