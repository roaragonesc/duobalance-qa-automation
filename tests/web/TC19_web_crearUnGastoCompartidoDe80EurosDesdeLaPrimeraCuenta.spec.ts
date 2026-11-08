import { expect, test } from '../../src/fixtures'

test('TC19_web_crearUnGastoCompartidoDe80EurosDesdeLaPrimeraCuenta', async ({ demoMember: _member, expensesPage }) => {
  await expensesPage.visit()
  await expensesPage.addExpense({ description: 'Supermercado E2E', amount: '80,00' })
  await expect(expensesPage.row('Supermercado E2E')).toHaveCount(1)
  await expect(expensesPage.row('Supermercado E2E')).toContainText('80,00')
  await expect(expensesPage.row('Supermercado E2E')).toContainText('Compartido')
  await expect(expensesPage.cell('Supermercado E2E', 'Tú')).toBeVisible()
})
