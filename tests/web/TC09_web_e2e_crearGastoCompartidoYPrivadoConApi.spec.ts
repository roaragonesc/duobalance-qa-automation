import { test, expect } from '../../src/fixtures/apiWeb'
import { ExpensesPage } from '../../src/pages/ExpensesPage'

test('TC09_web_e2e_crearGastoCompartidoYPrivadoConApi', async ({ apiCouple: _couple, page }) => {
  const expenses = new ExpensesPage(page)
  await expenses.visit()
  await expenses.addExpense({ description: 'Supermercado E2E', amount: '80,00' })
  await expenses.addExpense({ description: 'Peluquería E2E', amount: '35,00', individual: true })
  await expect(expenses.row('Supermercado E2E')).toContainText('80,00')
  await expect(expenses.row('Peluquería E2E')).toContainText('35,00')
  const privateUrl = await expenses.editUrl('Peluquería E2E')
  expect(privateUrl).toMatch(/\/expenses\/[a-f0-9]{24}\/edit/)
})
