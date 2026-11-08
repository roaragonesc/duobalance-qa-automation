import { expect, test } from '../../src/fixtures'
import { BalancePage } from '../../src/pages/BalancePage'
import { ExpensesPage } from '../../src/pages/ExpensesPage'

test('TC39_web_persistirImporteYSaldoActualizado', async ({
  sharedExpense: _shared, page, partnerPage, expensesPage,
}) => {
  await expensesPage.editAmount('Supermercado E2E', '100,00')

  for (const actor of [page, partnerPage]) {
    const balance = new BalancePage(actor)
    const expenses = new ExpensesPage(actor)
    await balance.visit()
    await expect(balance.debtSummary).toContainText('50,00')
    await balance.reload()
    await expect(balance.debtSummary).toContainText('50,00')
    await expenses.visit()
    await expect(expenses.row('Supermercado E2E')).toContainText('100,00')
  }
})
