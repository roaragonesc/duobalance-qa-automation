import { expect, test } from '../../src/fixtures'
import { ExpensesPage } from '../../src/pages/ExpensesPage'

test('TC26_web_consultarLosMismosDatosSinDuplicadosDesdeLaSegundaCuenta', async ({
  sharedExpense: _shared, partnerPage,
}) => {
  const partnerExpenses = new ExpensesPage(partnerPage)
  await partnerExpenses.visit()
  await expect(partnerExpenses.row('Supermercado E2E')).toHaveCount(1)
  await expect(partnerExpenses.row('Supermercado E2E')).toContainText('80,00')
  await expect(partnerExpenses.row('Supermercado E2E')).toContainText('Compartido')
  await expect(partnerExpenses.cell('Supermercado E2E', 'Ana')).toBeVisible()
})
