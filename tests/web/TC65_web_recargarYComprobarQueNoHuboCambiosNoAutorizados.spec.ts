import { expect, test } from '../../src/fixtures'
import { ExpensesPage } from '../../src/pages/ExpensesPage'

test('TC65_web_recargarYComprobarQueNoHuboCambiosNoAutorizados', async ({
  sharedAndPrivateExpenses: _expenses, page, partnerPage, expensesPage,
}) => {
  const partnerExpenses = new ExpensesPage(partnerPage)

  for (const actor of [page, partnerPage]) {
    const expenses = new ExpensesPage(actor)
    await expenses.visit()
    await expect(expenses.row('Supermercado E2E')).toBeVisible()
    await expenses.reload()
    await expect(expenses.row('Supermercado E2E')).toContainText('80,00')
    await expect(expenses.row('Supermercado E2E')).toHaveCount(1)
  }
  await expect(expensesPage.row('Peluquería E2E')).toContainText('35,00')
  await expect(partnerExpenses.row('Peluquería E2E')).toHaveCount(0)
})
