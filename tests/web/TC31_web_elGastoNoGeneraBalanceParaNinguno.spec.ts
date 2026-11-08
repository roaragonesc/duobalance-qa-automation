import { expect, test } from '../../src/fixtures'
import { BalancePage } from '../../src/pages/BalancePage'

test('TC31_web_elGastoNoGeneraBalanceParaNinguno', async ({
  privateExpense: _expense, page, partnerPage,
}) => {
  for (const actor of [page, partnerPage]) {
    const balance = new BalancePage(actor)
    await balance.visit()
    await expect(balance.noBalanceHeading).toBeVisible()
    await expect(balance.main).not.toContainText('Peluquería E2E')
  }
})
