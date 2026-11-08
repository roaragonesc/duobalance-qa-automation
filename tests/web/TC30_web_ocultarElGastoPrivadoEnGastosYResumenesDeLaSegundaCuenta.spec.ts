import { expect, test } from '../../src/fixtures'
import { DashboardPage } from '../../src/pages/DashboardPage'
import { ExpensesPage } from '../../src/pages/ExpensesPage'

test('TC30_web_ocultarElGastoPrivadoEnGastosYResumenesDeLaSegundaCuenta', async ({
  privateExpense: _expense, partnerPage,
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
