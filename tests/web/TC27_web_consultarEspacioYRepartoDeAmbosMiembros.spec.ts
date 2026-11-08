import { expect, test } from '../../src/fixtures'
import { BalancePage } from '../../src/pages/BalancePage'
import { SpacePage } from '../../src/pages/SpacePage'

test('TC27_web_consultarEspacioYRepartoDeAmbosMiembros', async ({
  sharedExpense: _shared, page, partnerPage,
}) => {
  for (const actor of [page, partnerPage]) {
    const space = new SpacePage(actor)
    const balance = new BalancePage(actor)
    await space.visit()
    await expect(space.heading('Hogar E2E')).toBeVisible()
    await expect(space.summary).toContainText('50 % / 50 %')
    await balance.visit()
    await expect(balance.ownContribution).toContainText('40,00')
    await expect(balance.ownContribution).toContainText('50')
  }
})
