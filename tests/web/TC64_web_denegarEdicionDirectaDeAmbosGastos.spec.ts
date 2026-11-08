import { expect, test } from '../../src/fixtures'
import { ExpensesPage } from '../../src/pages/ExpensesPage'

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
