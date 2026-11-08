import { expect, test } from '../../src/fixtures'

// Requiere API real: necesita dos sesiones con datos compartidos y no se puede probar en modo mock.
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC34_web_registrarPagoDe80EurosDesdeLaPrimeraCuenta', async ({
  couple: _couple, expensesPage, balancePage,
}) => {
  await expensesPage.addExpense({ description: 'Supermercado E2E', amount: '80,00' })
  await balancePage.visit()
  await expect(balancePage.debtSummary).toContainText('Luis te debe')
  await expect(balancePage.debtSummary).toContainText('40,00')
})
