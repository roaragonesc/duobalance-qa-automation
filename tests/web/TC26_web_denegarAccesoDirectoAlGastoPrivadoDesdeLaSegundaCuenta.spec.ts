import { expect, test } from '../../src/fixtures'
import { ExpensesPage } from '../../src/pages/ExpensesPage'

// Requiere API real: necesita dos sesiones con datos compartidos y no se puede probar en modo mock.
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC26_web_denegarAccesoDirectoAlGastoPrivadoDesdeLaSegundaCuenta', async ({
  privateExpense: _expense,
  partnerPage,
  expensesPage,
}) => {
  const partnerExpenses = new ExpensesPage(partnerPage)
  const editUrl = await expensesPage.editUrl('Peluquería E2E')

  await partnerExpenses.openEditor(editUrl)
  await expect(partnerExpenses.alert).toHaveText(partnerExpenses.permissionDeniedMessage)
  await expect(partnerExpenses.conceptField).toHaveCount(0)
})
