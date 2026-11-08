import { expect, test } from '../../src/fixtures'
import { journeyUsers } from '../../src/data/journeyUsers'
import { ExpensesPage } from '../../src/pages/ExpensesPage'
import { ProfilePage } from '../../src/pages/ProfilePage'

// Requiere API real: necesita dos sesiones con datos compartidos y no se puede probar en modo mock.
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC19_web_consultarLosMismosDatosSinDuplicadosDesdeLaSegundaCuenta', async ({
  sharedExpense: _shared,
  partnerPage,
}) => {
  const luisProfile = new ProfilePage(partnerPage)
  const luisExpenses = new ExpensesPage(partnerPage)

  await test.step('1. Luis abre su perfil y comprueba que es Luis', async () => {
    await luisProfile.visit()
    await expect(luisProfile.nameHeading(journeyUsers.b.name)).toBeVisible()
    await expect(luisProfile.emailText(journeyUsers.b.email)).toBeVisible()
  })

  await test.step('2. Luis abre la lista de gastos', async () => {
    await luisExpenses.visit()
  })

  await test.step('3. Luis ve el gasto compartido de Ana una sola vez', async () => {
    await expect(luisExpenses.row('Supermercado E2E')).toHaveCount(1)
    await expect(luisExpenses.row('Supermercado E2E')).toContainText('80,00')
    await expect(luisExpenses.row('Supermercado E2E')).toContainText('Compartido')
    await expect(luisExpenses.cell('Supermercado E2E', 'Ana')).toBeVisible()
  })
})
