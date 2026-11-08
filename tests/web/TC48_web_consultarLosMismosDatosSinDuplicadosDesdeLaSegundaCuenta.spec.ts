import { expect, test } from '../../src/fixtures'
import { ExpensesPage } from '../../src/pages/ExpensesPage'

// Requiere API real: necesita dos sesiones con datos compartidos y no se puede probar en modo mock.
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC48_web_consultarLosMismosDatosSinDuplicadosDesdeLaSegundaCuenta', async ({
  sharedExpense: _shared, partnerPage,
}) => {
  const partnerExpenses = new ExpensesPage(partnerPage)
  await partnerExpenses.visit()
  await expect(partnerExpenses.row('Supermercado E2E')).toHaveCount(1)
  await expect(partnerExpenses.row('Supermercado E2E')).toContainText('80,00')
  await expect(partnerExpenses.row('Supermercado E2E')).toContainText('Compartido')
  await expect(partnerExpenses.cell('Supermercado E2E', 'Ana')).toBeVisible()
})
