import { expect, test } from '../../src/fixtures'
import { ExpensesPage } from '../../src/pages/ExpensesPage'

// Requiere API real: necesita dos sesiones con datos compartidos y no se puede probar en modo mock.
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC43_web_actualizarAmbasVistasSinDuplicadosNiFiltraciones', async ({
  balancedExpenses: _expenses,
  page,
  partnerPage,
  expensesPage,
}) => {
  const partnerExpenses = new ExpensesPage(partnerPage)

  for (const actor of [page, partnerPage]) {
    const expenses = new ExpensesPage(actor)
    await expenses.visit()
    await expect(expenses.row('Supermercado E2E')).toBeVisible()
    await expenses.reload()
    await expect(expenses.row('Supermercado E2E')).toHaveCount(1)
    await expect(expenses.row('Gasolina E2E')).toHaveCount(1)
    await expect(expenses.sharedTotal).toContainText('120,00')
  }
  await expect(expensesPage.row('Peluquería E2E')).toContainText('35,00')
  await expect(partnerExpenses.row('Peluquería E2E')).toHaveCount(0)
  await expect(partnerExpenses.individualTotal).toContainText('0,00')
})
