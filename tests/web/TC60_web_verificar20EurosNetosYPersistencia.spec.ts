import { expect, test } from '../../src/fixtures'
import { BalancePage } from '../../src/pages/BalancePage'

test('TC60_web_verificar20EurosNetosYPersistencia', async ({
  balancedExpenses: _expenses, page, partnerPage,
}) => {
  const ownBalance = new BalancePage(page)
  const partnerBalance = new BalancePage(partnerPage)
  for (const balance of [ownBalance, partnerBalance]) {
    await balance.visit()
    await expect(balance.debtSummary).toContainText('20,00')
    await expect(balance.monthSummary).toContainText('120,00')
    await balance.reload()
    await expect(balance.debtSummary).toContainText('20,00')
  }
  await expect(ownBalance.debtSummary).toContainText('Luis te debe')
  await expect(partnerBalance.debtSummary).toContainText('Tú debes a Ana')
})
