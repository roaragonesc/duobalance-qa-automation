import { expect, test } from '../../src/fixtures'

test('TC57_web_crearUnGastoComunYOtroPrivadoDesdeLaPrimeraCuenta', async ({
  couple: _couple, expensesPage,
}) => {
  await expensesPage.visit()
  await expensesPage.addExpense({ description: 'Supermercado E2E', amount: '80,00' })
  await expensesPage.addExpense({ description: 'Peluquería E2E', amount: '35,00', individual: true })
  await expect(expensesPage.row('Supermercado E2E')).toContainText('80,00')
  await expect(expensesPage.row('Peluquería E2E')).toContainText('35,00')
})
