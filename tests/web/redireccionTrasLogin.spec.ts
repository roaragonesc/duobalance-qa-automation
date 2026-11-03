import { expect, test } from '../fixtures'
import { demoUsers } from '../data/demoUsers'

test('TC27_volverALaRutaPrivadaTrasIniciarSesion', async ({ page, loginPage }) => {
  await page.goto('./#/expenses')
  await expect(page).toHaveURL(/\/login$/)

  await loginPage.signIn(demoUsers.rocio.email, demoUsers.rocio.password)

  await expect(page).toHaveURL(/\/expenses$/)
  await expect(page.getByRole('heading', { name: 'Gastos', exact: true })).toBeVisible()
})
