import { expect, test } from '../../src/fixtures'
import { ExpensesPage } from '../../src/pages/ExpensesPage'

// Requiere API real: necesita dos sesiones con datos compartidos y no se puede probar en modo mock.
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC64_web_denegarEdicionDirectaDeAmbosGastos', async ({
  sharedAndPrivateExpenses: _expenses, partnerPage, expensesPage,
}) => {
  const partnerExpenses = new ExpensesPage(partnerPage)
  const privateUrl = await expensesPage.editUrl('Peluquería E2E')
  const sharedUrl = await expensesPage.editUrl('Supermercado E2E')

  for (const url of [privateUrl, sharedUrl]) {
    await partnerExpenses.openEditor(url)
    await expect(partnerExpenses.alert).toHaveText(partnerExpenses.permissionDeniedMessage)
    await expect(partnerExpenses.saveButton).toHaveCount(0)
  }
})
