import { test, expect } from '../../src/fixtures/apiWeb'
import { ExpensesPage } from '../../src/pages/ExpensesPage'

test('TC10_web_e2e_protegerElGastoPrivadoEntreSesionesConApi', async ({ apiExpenses, partnerPage }) => {
  const expenses = new ExpensesPage(partnerPage)
  await expenses.visit()
  await expect(expenses.row('Supermercado E2E')).toContainText('80,00')
  await expect(expenses.row('Peluquería E2E')).toHaveCount(0)
  await expenses.openEditor(apiExpenses.privateUrl)
  await expect(expenses.alert).toHaveText(expenses.permissionDeniedMessage)
  await expenses.visit()
  await expenses.addExpense({ description: 'Gasolina E2E', amount: '40,00' })
  await expect(expenses.row('Gasolina E2E')).toContainText('40,00')
})
