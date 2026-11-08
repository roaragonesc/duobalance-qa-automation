import { expect, test } from '../../src/fixtures'
import { ExpensesPage } from '../../src/pages/ExpensesPage'

test('TC58_web_consultarSoloElGastoComunYCrearOtroDesdeLaSegundaCuenta', async ({
  sharedAndPrivateExpenses: _expenses, partnerPage,
}) => {
  const partnerExpenses = new ExpensesPage(partnerPage)

  await partnerExpenses.visit()
  await expect(partnerExpenses.row('Supermercado E2E')).toContainText('80,00')
  await expect(partnerExpenses.row('Peluquería E2E')).toHaveCount(0)
  await partnerExpenses.filterByType('individual')
  await expect(partnerExpenses.row('Peluquería E2E')).toHaveCount(0)
  await partnerExpenses.filterByType('all')
  await partnerExpenses.addExpense({ description: 'Gasolina E2E', amount: '40,00' })
  await expect(partnerExpenses.row('Gasolina E2E')).toContainText('40,00')
})
