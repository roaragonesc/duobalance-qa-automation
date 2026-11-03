import { expect, test } from '../fixtures/pagesDemo'
import { frontendURL } from '../helpers/environment'

test('TC24_accederAlFrontendPublicadoConservandoLaRutaBase', async ({ page }) => {
  const response = await page.goto('./')
  expect(response?.status()).toBe(200)
  await expect(page).toHaveURL(new URL('./#/login', frontendURL).href)
  await expect(page.getByRole('heading', { name: 'Login', exact: true })).toBeVisible()
  await expect(page.getByRole('complementary', { name: 'Modo mock de desarrollo' }))
    .toContainText('No se sincroniza entre dispositivos.')
  await page.getByRole('link', { name: 'Registrarse', exact: true }).click()
  await expect(page).toHaveURL(new URL('./#/register', frontendURL).href)
  await expect(page.getByRole('button', { name: 'Crear cuenta', exact: true })).toBeVisible()
})
