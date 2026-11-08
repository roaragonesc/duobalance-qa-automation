import { expect, test } from '../../src/fixtures'

test('TC34_web_registrarPagoDe80EurosDesdeLaPrimeraCuenta', async ({
  couple: _couple, expensesPage, balancePage,
}) => {
  await expensesPage.addExpense({ description: 'Supermercado E2E', amount: '80,00' })
  await balancePage.visit()
  await expect(balancePage.debtSummary).toContainText('Luis te debe')
  await expect(balancePage.debtSummary).toContainText('40,00')
})
