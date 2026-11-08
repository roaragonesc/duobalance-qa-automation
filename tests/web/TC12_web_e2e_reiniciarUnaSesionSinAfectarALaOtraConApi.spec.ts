import { test, expect } from '../../src/fixtures/apiWeb'
import { ExpensesPage } from '../../src/pages/ExpensesPage'
import { ProfilePage } from '../../src/pages/ProfilePage'
import { LoginPage } from '../../src/pages/LoginPage'

test('TC12_web_e2e_reiniciarUnaSesionSinAfectarALaOtraConApi', async ({
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
