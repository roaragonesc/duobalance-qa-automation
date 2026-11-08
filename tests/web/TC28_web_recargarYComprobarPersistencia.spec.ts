import { expect, test } from '../../src/fixtures'
import { ExpensesPage } from '../../src/pages/ExpensesPage'

// Requiere API real: necesita dos sesiones con datos compartidos y no se puede probar en modo mock.
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC28_web_recargarYComprobarPersistencia', async ({
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
