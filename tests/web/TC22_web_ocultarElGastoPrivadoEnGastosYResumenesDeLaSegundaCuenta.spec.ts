import { expect, test } from '../../src/fixtures'
import { journeyUsers } from '../../src/data/journeyUsers'
import { DashboardPage } from '../../src/pages/DashboardPage'
import { ExpensesPage } from '../../src/pages/ExpensesPage'
import { ProfilePage } from '../../src/pages/ProfilePage'

// Requiere API real: necesita dos sesiones con datos compartidos y no se puede probar en modo mock.
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC22_web_ocultarElGastoPrivadoEnGastosYResumenesDeLaSegundaCuenta', async ({
  privateExpense: _expense,
  partnerPage,
}) => {
  const luisProfile = new ProfilePage(partnerPage)
  const luisExpenses = new ExpensesPage(partnerPage)
  const luisDashboard = new DashboardPage(partnerPage)

  await test.step('1. Luis abre su perfil y comprueba que es Luis', async () => {
    await luisProfile.visit()
    await expect(luisProfile.nameHeading(journeyUsers.b.name)).toBeVisible()
    await expect(luisProfile.emailText(journeyUsers.b.email)).toBeVisible()
  })

  await test.step('2. Luis abre la lista de gastos y no ve el gasto privado de Ana', async () => {
    await luisExpenses.visit()
    await expect(luisExpenses.noExpensesHeading).toBeVisible()
    await expect(luisExpenses.main).not.toContainText('Peluquería E2E')
  })

  await test.step('3. Luis abre el panel y no ve el gasto privado de Ana', async () => {
    await luisDashboard.visit()
    await expect(luisDashboard.noExpensesHeading).toBeVisible()
    await expect(luisDashboard.main).not.toContainText('Peluquería E2E')
  })
})
