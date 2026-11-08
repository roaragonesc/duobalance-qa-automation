import { expect, test } from '../../src/fixtures'
import { ExpensesPage } from '../../src/pages/ExpensesPage'

test('TC33_web_conservarElGastoPropioSinRevelarloMedianteFiltrosALaOtraCuenta', async ({
  privateExpense: _expense, partnerPage, expensesPage,
}) => {
  const partnerExpenses = new ExpensesPage(partnerPage)

  await expensesPage.visit()
  await expect(expensesPage.row('Peluquería E2E')).toBeVisible()
  await expensesPage.reload()
  await expect(expensesPage.row('Peluquería E2E')).toHaveCount(1)
  await expect(expensesPage.row('Peluquería E2E')).toContainText('35,00')
  // A shared control expense makes the filter controls available in Luis's list.
  await expensesPage.addExpense({ description: 'Control compartido', amount: '2,00' })
  await partnerExpenses.visit()
  await expect(partnerExpenses.row('Control compartido')).toBeVisible()
  await partnerExpenses.filterByType('individual')
  await expect(partnerExpenses.row('Peluquería E2E')).toHaveCount(0)
  await expect(partnerExpenses.individualTotal).toContainText('0,00')
  await partnerExpenses.filterByType('shared')
  await partnerExpenses.filterByCategory('food')
  await expect(partnerExpenses.row('Control compartido')).toBeVisible()
  await expect(partnerExpenses.row('Peluquería E2E')).toHaveCount(0)
})
