import { expect, test } from '../../src/fixtures'

test('TC69_web_comprobarRepartoYPersistenciaLocal', async ({
  demoSharedExpense: _expense, navigation, balancePage,
}) => {
  await navigation.open('Balance')
  await expect(balancePage.monthSummary).toContainText('785,80')
  await expect(balancePage.ownContribution).toContainText('392,90')
  await expect(balancePage.monthBalance).toContainText('187,10')
  await expect(balancePage.debtSummary).toContainText('314,20')
  await balancePage.reload()
  await expect(balancePage.debtSummary).toContainText('314,20')
})
