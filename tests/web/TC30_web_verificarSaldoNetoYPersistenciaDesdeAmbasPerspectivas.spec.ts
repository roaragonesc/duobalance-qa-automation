import { expect, test } from '../../src/fixtures'
import { BalancePage } from '../../src/pages/BalancePage'

// Requiere API real: necesita dos sesiones con datos compartidos y no se puede probar en modo mock.
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC30_web_verificarSaldoNetoYPersistenciaDesdeAmbasPerspectivas', async ({
  balancedExpenses: _expenses,
  page,
  partnerPage,
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
