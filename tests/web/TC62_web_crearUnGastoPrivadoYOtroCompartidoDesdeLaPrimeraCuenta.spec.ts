import { expect, test } from '../../src/fixtures'

test('TC62_web_crearUnGastoPrivadoYOtroCompartidoDesdeLaPrimeraCuenta', async ({
  couple: _couple, expensesPage,
}) => {
  await expensesPage.addExpense({ description: 'Peluquería E2E', amount: '35,00', individual: true })
  await expect(expensesPage.editLink('Peluquería E2E')).toBeVisible()
  await expensesPage.addExpense({ description: 'Supermercado E2E', amount: '80,00' })
  await expect(expensesPage.editLink('Supermercado E2E')).toBeVisible()
  await expect(expensesPage.deleteButton('Supermercado E2E')).toBeVisible()
})
