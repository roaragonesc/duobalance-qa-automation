import { expect, test } from '../../src/fixtures'
import { ExpensesPage } from '../../src/pages/ExpensesPage'

// Requiere API real: necesita dos sesiones con datos compartidos y no se puede probar en modo mock.
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC29_web_registrarPagoDe40EurosDesdeLaSegundaCuenta', async ({ couple: _couple, partnerPage }) => {
  const partnerExpenses = new ExpensesPage(partnerPage)
  await partnerExpenses.visit()
  await partnerExpenses.addExpense({ description: 'Gasolina E2E', amount: '40,00' })
  await expect(partnerExpenses.row('Gasolina E2E')).toContainText('40,00')
})
