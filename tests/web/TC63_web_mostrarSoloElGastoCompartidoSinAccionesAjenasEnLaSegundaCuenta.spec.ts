import { expect, test } from '../../src/fixtures'
import { ExpensesPage } from '../../src/pages/ExpensesPage'

test('TC63_web_mostrarSoloElGastoCompartidoSinAccionesAjenasEnLaSegundaCuenta', async ({
  sharedAndPrivateExpenses: _expenses, partnerPage,
}) => {
  const partnerExpenses = new ExpensesPage(partnerPage)

  await partnerExpenses.visit()
  await expect(partnerExpenses.row('Peluquería E2E')).toHaveCount(0)
  await expect(partnerExpenses.row('Supermercado E2E')).toContainText('80,00')
  await expect(partnerExpenses.editLink('Supermercado E2E')).toHaveCount(0)
  await expect(partnerExpenses.deleteButton('Supermercado E2E')).toHaveCount(0)
})
