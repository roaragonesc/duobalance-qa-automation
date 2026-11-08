import { expect, test } from '../../src/fixtures'
import { ExpensesPage } from '../../src/pages/ExpensesPage'
import { LoginPage } from '../../src/pages/LoginPage'
import { ProfilePage } from '../../src/pages/ProfilePage'

test('TC61_web_cerrarLaSegundaSesionSinAfectarALaPrimera', async ({
  balancedExpenses: _expenses, partnerPage, expensesPage,
}) => {
  const partnerExpenses = new ExpensesPage(partnerPage)
  const partnerLogin = new LoginPage(partnerPage)

  await new ProfilePage(partnerPage).signOut()
  await partnerLogin.expectOpen()
  await partnerExpenses.visit()
  await partnerLogin.expectOpen()
  await expensesPage.visit()
  await expect(expensesPage.row('Supermercado E2E')).toContainText('80,00')
  await expect(expensesPage.row('Gasolina E2E')).toContainText('40,00')
  await expect(expensesPage.row('Peluquería E2E')).toContainText('35,00')
})
