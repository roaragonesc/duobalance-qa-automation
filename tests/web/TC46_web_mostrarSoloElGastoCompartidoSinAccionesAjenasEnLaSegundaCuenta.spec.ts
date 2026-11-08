import { expect, test } from '../../src/fixtures'
import { ExpensesPage } from '../../src/pages/ExpensesPage'

// Requiere API real: necesita dos sesiones con datos compartidos y no se puede probar en modo mock.
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC46_web_mostrarSoloElGastoCompartidoSinAccionesAjenasEnLaSegundaCuenta', async ({
  sharedAndPrivateExpenses: _expenses,
  partnerPage,
}) => {
  const partnerExpenses = new ExpensesPage(partnerPage)

  await partnerExpenses.visit()
  await expect(partnerExpenses.row('Peluquería E2E')).toHaveCount(0)
  await expect(partnerExpenses.row('Supermercado E2E')).toContainText('80,00')
  await expect(partnerExpenses.editLink('Supermercado E2E')).toHaveCount(0)
  await expect(partnerExpenses.deleteButton('Supermercado E2E')).toHaveCount(0)
})
