import { expect, test } from '../../src/fixtures'

test('TC73_web_cambiarIdentidadDentroDelMismoAlmacenDemo', async ({
  demoPrivateExpense: _expense, demoPanel, expensesPage,
}) => {
  await demoPanel.selectUser('pablo')
  await expensesPage.visit()
  await expect(expensesPage.row('Gasto privado Pages')).toHaveCount(0)
  await expensesPage.filterByType('individual')
  await expect(expensesPage.row('Gasto privado Pages')).toHaveCount(0)
  await demoPanel.selectUser('rocio')
  await expensesPage.visit()
  await expect(expensesPage.row('Gasto privado Pages')).toContainText('35,00')
})
