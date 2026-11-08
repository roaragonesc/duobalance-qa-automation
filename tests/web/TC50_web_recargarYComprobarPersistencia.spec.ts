import { expect, test } from '../../src/fixtures'
import { ExpensesPage } from '../../src/pages/ExpensesPage'

test('TC50_web_recargarYComprobarPersistencia', async ({
  sharedExpense: _shared, page, partnerPage,
}) => {
  for (const actor of [page, partnerPage]) {
    const expenses = new ExpensesPage(actor)
    await expenses.visit()
    await expect(expenses.row('Supermercado E2E')).toBeVisible()
    await expenses.reload()
    await expect(expenses.row('Supermercado E2E')).toHaveCount(1)
    await expect(expenses.row('Supermercado E2E')).toContainText('80,00')
  }
})
