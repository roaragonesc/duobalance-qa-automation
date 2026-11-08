import { expect, test } from '../../src/fixtures'
import { DashboardPage } from '../../src/pages/DashboardPage'
import { ExpensesPage } from '../../src/pages/ExpensesPage'

// Requiere API real: necesita dos sesiones con datos compartidos y no se puede probar en modo mock.
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC24_web_ocultarElGastoPrivadoEnGastosYResumenesDeLaSegundaCuenta', async ({
  privateExpense: _expense,
  partnerPage,
}) => {
  const partnerExpenses = new ExpensesPage(partnerPage)
  const partnerDashboard = new DashboardPage(partnerPage)

  await partnerExpenses.visit()
  await expect(partnerExpenses.noExpensesHeading).toBeVisible()
  await expect(partnerExpenses.main).not.toContainText('Peluquería E2E')
  await partnerDashboard.visit()
  await expect(partnerDashboard.noExpensesHeading).toBeVisible()
  await expect(partnerDashboard.main).not.toContainText('Peluquería E2E')
})
