import { test, expect } from '../../src/fixtures/apiWeb'
import { BalancePage } from '../../src/pages/BalancePage'
import { ExpensesPage } from '../../src/pages/ExpensesPage'

test('TC11_web_e2e_conservarBalanceDe20EurosEntreSesionesConApi', async ({
  apiBalanced: _balanced, page, partnerPage,
}) => {
  const ownBalance = new BalancePage(page)
  const partnerBalance = new BalancePage(partnerPage)
  for (const actor of [page, partnerPage]) {
    const balance = new BalancePage(actor)
    await new ExpensesPage(actor).visit()
    await expect(new ExpensesPage(actor).row('Gasolina E2E')).toContainText('40,00')
    await balance.visit()
    await expect(balance.debtSummary).toContainText('20,00')
    await balance.reload()
    await expect(balance.debtSummary).toContainText('20,00')
  }
  await expect(ownBalance.debtSummary).toContainText('Luis te debe')
  await expect(partnerBalance.debtSummary).toContainText('Tú debes a Ana')
})
