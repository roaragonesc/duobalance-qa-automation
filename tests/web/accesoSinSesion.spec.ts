import { expect, test } from '../fixtures'

test('TC07_impedirElAccesoSinSesion', async ({ page }) => {
  await page.goto('./#/expenses')
  await expect(page).toHaveURL(/\/login$/)
  await expect(page.getByRole('heading', { name: 'Gastos', exact: true })).toHaveCount(0)
})
