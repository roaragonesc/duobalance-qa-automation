import { test, expect } from '../fixtures/apiWeb'
import { ExpensesPage } from '../pages/ExpensesPage'
import { ProfilePage } from '../pages/ProfilePage'
import { LoginPage } from '../pages/LoginPage'

test('TC33_reiniciarUnaSesionSinAfectarALaOtraConApi', async ({
  apiBalanced: _balanced, page, partnerPage, users,
}) => {
  await new ProfilePage(partnerPage).signOut()
  await expect(partnerPage).toHaveURL(/\/login$/)
  const firstExpenses = new ExpensesPage(page)
  await firstExpenses.visit()
  await expect(firstExpenses.row('Peluquería E2E')).toContainText('35,00')
  await new LoginPage(partnerPage).signIn(users.b.email, users.b.password)
  await expect(partnerPage).toHaveURL(/\/profile$/)
  const partnerExpenses = new ExpensesPage(partnerPage)
  await partnerExpenses.visit()
  await expect(partnerExpenses.row('Gasolina E2E')).toContainText('40,00')
  await expect(partnerExpenses.row('Supermercado E2E')).toContainText('80,00')
  await expect(partnerExpenses.row('Peluquería E2E')).toHaveCount(0)
})
