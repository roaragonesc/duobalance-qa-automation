import { test, expect } from '../fixtures/apiWeb'
import { ExpensesPage } from '../pages/ExpensesPage'

test('TC31_protegerElGastoPrivadoEntreSesionesConApi', async ({ apiExpenses, partnerPage }) => {
  const expenses = new ExpensesPage(partnerPage)
  await expenses.visit()
  await expect(expenses.row('Supermercado E2E')).toContainText('80,00')
  await expect(expenses.row('Peluquería E2E')).toHaveCount(0)
  await partnerPage.goto(apiExpenses.privateUrl)
  await expect(partnerPage.getByRole('alert'))
    .toHaveText('No se ha encontrado el gasto o no tienes permiso para modificarlo.')
  await expenses.visit()
  await expenses.addExpense({ description: 'Gasolina E2E', amount: '40,00' })
  await expect(expenses.row('Gasolina E2E')).toContainText('40,00')
})
