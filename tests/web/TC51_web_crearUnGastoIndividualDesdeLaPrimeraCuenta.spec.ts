import { expect, test } from '../../src/fixtures'

test('TC51_web_crearUnGastoIndividualDesdeLaPrimeraCuenta', async ({
  couple: _couple, expensesPage,
}) => {
  await expensesPage.addExpense({ description: 'Peluquería E2E', amount: '35,00', individual: true })
  await expect(expensesPage.row('Peluquería E2E')).toContainText('35,00')
  await expect(expensesPage.row('Peluquería E2E')).toContainText('Individual')
  await expect(expensesPage.editLink('Peluquería E2E')).toBeVisible()
})
