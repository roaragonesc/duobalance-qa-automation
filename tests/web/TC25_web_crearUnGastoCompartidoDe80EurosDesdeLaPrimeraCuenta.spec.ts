import { expect, test } from '../../src/fixtures'

test('TC25_web_crearUnGastoCompartidoDe80EurosDesdeLaPrimeraCuenta', async ({
  couple: _couple, expensesPage,
}) => {
  await expensesPage.addExpense({ description: 'Supermercado E2E', amount: '80,00' })
  await expect(expensesPage.row('Supermercado E2E')).toHaveCount(1)
  await expect(expensesPage.row('Supermercado E2E')).toContainText('80,00')
  await expect(expensesPage.row('Supermercado E2E')).toContainText('Compartido')
  await expect(expensesPage.cell('Supermercado E2E', 'Tú')).toBeVisible()
})
