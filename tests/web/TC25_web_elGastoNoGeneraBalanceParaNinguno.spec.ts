import { expect, test } from '../../src/fixtures'
import { BalancePage } from '../../src/pages/BalancePage'

// Requiere API real: necesita dos sesiones con datos compartidos y no se puede probar en modo mock.
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC25_web_elGastoNoGeneraBalanceParaNinguno', async ({ privateExpense: _expense, page, partnerPage }) => {
  for (const actor of [page, partnerPage]) {
    const balance = new BalancePage(actor)
    await balance.visit()
    await expect(balance.noBalanceHeading).toBeVisible()
    await expect(balance.main).not.toContainText('Peluquería E2E')
  }
})
