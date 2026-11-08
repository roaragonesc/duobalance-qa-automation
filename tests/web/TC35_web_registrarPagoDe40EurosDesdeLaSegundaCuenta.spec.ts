import { expect, test } from '../../src/fixtures'
import { ExpensesPage } from '../../src/pages/ExpensesPage'

test('TC35_web_registrarPagoDe40EurosDesdeLaSegundaCuenta', async ({
  couple: _couple, partnerPage,
}) => {
  const partnerExpenses = new ExpensesPage(partnerPage)
  await partnerExpenses.visit()
  await partnerExpenses.addExpense({ description: 'Gasolina E2E', amount: '40,00' })
  await expect(partnerExpenses.row('Gasolina E2E')).toContainText('40,00')
})
