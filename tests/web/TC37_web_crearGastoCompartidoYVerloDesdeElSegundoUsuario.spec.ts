import { expect, test } from '../../src/fixtures'
import { ExpensesPage } from '../../src/pages/ExpensesPage'

test('TC37_web_crearGastoCompartidoYVerloDesdeElSegundoUsuario', async ({
  couple: _couple, partnerPage, expensesPage,
}) => {
  const partnerExpenses = new ExpensesPage(partnerPage)
  await expensesPage.addExpense({ description: 'Supermercado E2E', amount: '80,00' })
  await partnerExpenses.visit()
  await expect(partnerExpenses.row('Supermercado E2E')).toContainText('80,00')
})
