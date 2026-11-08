import { expect, test } from '../../src/fixtures'

test('TC70_web_editarGastoPropioYRecalcularSinDuplicados', async ({
  demoSharedExpense: _expense, navigation, expensesPage, balancePage,
}) => {
  await expensesPage.visit()
  await expensesPage.editAmount('Compra compartida Pages', '100,00')
  await expensesPage.reload()
  await expect(expensesPage.row('Compra compartida Pages')).toHaveCount(1)
  await expect(expensesPage.row('Compra compartida Pages')).toContainText('100,00')
  await navigation.open('Balance')
  await expect(balancePage.monthSummary).toContainText('805,80')
  await expect(balancePage.debtSummary).toContainText('304,20')
})
