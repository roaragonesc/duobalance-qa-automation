import { expect, test } from '../../src/fixtures'
import { ExpensesPage } from '../../src/pages/ExpensesPage'

// Requiere API real: necesita dos sesiones con datos compartidos y no se puede probar en modo mock.
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC38_web_abrirLaEdicionPorTecladoYModificarElGastoPropio', async ({
  sharedExpense: _shared, partnerPage, expensesPage,
}) => {
  const partnerExpenses = new ExpensesPage(partnerPage)
  await partnerExpenses.visit()

  await expensesPage.editAmount('Supermercado E2E', '100,00')
  await expect(expensesPage.row('Supermercado E2E')).toContainText('100,00')
  await partnerExpenses.reload()
  await expect(partnerExpenses.row('Supermercado E2E')).toContainText('100,00')
  await expect(partnerExpenses.row('Supermercado E2E')).toHaveCount(1)
})
