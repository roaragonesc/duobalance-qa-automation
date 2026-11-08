import { expect, test } from '../../src/fixtures'
import { ExpensesPage } from '../../src/pages/ExpensesPage'

test('TC54_web_denegarAccesoDirectoAlGastoPrivadoDesdeLaSegundaCuenta', async ({
  privateExpense: _expense, partnerPage, expensesPage,
}) => {
  const partnerExpenses = new ExpensesPage(partnerPage)
  const editUrl = await expensesPage.editUrl('Peluquería E2E')

  await partnerExpenses.openEditor(editUrl)
  await expect(partnerExpenses.alert).toHaveText(partnerExpenses.permissionDeniedMessage)
  await expect(partnerExpenses.conceptField).toHaveCount(0)
})
