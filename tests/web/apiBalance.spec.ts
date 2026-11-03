import { test, expect } from '../fixtures/apiWeb'
import { ExpensesPage } from '../pages/ExpensesPage'

test('TC32_conservarBalanceDe20EurosEntreSesionesConApi', async ({
  apiBalanced: _balanced, page, partnerPage,
}) => {
  for (const actor of [page, partnerPage]) {
    await actor.goto('/expenses')
    await expect(new ExpensesPage(actor).row('Gasolina E2E')).toContainText('40,00')
    await actor.goto('/balance')
    await expect(actor.getByRole('region', { name: '¿Quién debe a quién?' })).toContainText('20,00')
    await actor.reload()
    await expect(actor.getByRole('region', { name: '¿Quién debe a quién?' })).toContainText('20,00')
  }
  await expect(page.getByRole('region', { name: '¿Quién debe a quién?' })).toContainText('Luis te debe')
  await expect(partnerPage.getByRole('region', { name: '¿Quién debe a quién?' })).toContainText('Tú debes a Ana')
})
