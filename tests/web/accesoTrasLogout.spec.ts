import { expect, test } from '../fixtures'
import { demoUsers } from '../data/demoUsers'

test('TC28_impedirElAccesoAlVolverAtrasTrasCerrarSesion', async ({
  page, loginPage, profilePage,
}) => {
  await page.goto('./#/expenses')
  await expect(page).toHaveURL(/\/login$/)
  await loginPage.signIn(demoUsers.rocio.email, demoUsers.rocio.password)
  await expect(page).toHaveURL(/\/expenses$/)
  await expect(page.getByRole('heading', { name: 'Gastos', exact: true })).toBeVisible()

  await profilePage.signOut()

  await expect(page).toHaveURL(/\/login$/)
  await page.goBack()
  await expect(page).toHaveURL(/\/login$/)
  await expect(page.getByRole('heading', { name: 'Gastos', exact: true })).toHaveCount(0)
  await page.goto('./#/expenses')
  await expect(page).toHaveURL(/\/login$/)
})
