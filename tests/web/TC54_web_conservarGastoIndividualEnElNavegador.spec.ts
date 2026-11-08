import { expect, test } from '../../src/fixtures'

test('TC54_web_conservarGastoIndividualEnElNavegador', async ({ demoPanel, expensesPage }) => {
  await demoPanel.selectUser('rocio')
  await expensesPage.visit()
  await expensesPage.addExpense({ description: 'Gasto privado Pages', amount: '35,00', individual: true })
  await expect(expensesPage.row('Gasto privado Pages')).toContainText('35,00')
  await expect(expensesPage.row('Gasto privado Pages')).toContainText('Individual')
  await expensesPage.reload()
  await expect(expensesPage.row('Gasto privado Pages')).toHaveCount(1)
  await expect(expensesPage.row('Gasto privado Pages')).toContainText('35,00')
})
