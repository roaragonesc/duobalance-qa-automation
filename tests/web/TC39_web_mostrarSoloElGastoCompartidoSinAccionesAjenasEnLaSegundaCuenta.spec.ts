import { expect, test } from '../../src/fixtures'
import { journeyUsers } from '../../src/data/journeyUsers'
import { ExpensesPage } from '../../src/pages/ExpensesPage'
import { ProfilePage } from '../../src/pages/ProfilePage'

// Requiere API real: necesita dos sesiones con datos compartidos y no se puede probar en modo mock.
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC39_web_mostrarSoloElGastoCompartidoSinAccionesAjenasEnLaSegundaCuenta', async ({
  sharedAndPrivateExpenses: _expenses,
  partnerPage,
}) => {
  const luisProfile = new ProfilePage(partnerPage)
  const luisExpenses = new ExpensesPage(partnerPage)

  await test.step('1. Luis abre su perfil y comprueba que es Luis', async () => {
    await luisProfile.visit()
    await expect(luisProfile.nameHeading(journeyUsers.b.name)).toBeVisible()
    await expect(luisProfile.emailText(journeyUsers.b.email)).toBeVisible()
  })

  await test.step('2. Luis abre la lista de gastos y no ve el gasto privado de Ana', async () => {
    await luisExpenses.visit()
    await expect(luisExpenses.row('Peluquería E2E')).toHaveCount(0)
  })

  await test.step('3. Luis ve el gasto compartido sin acciones de edición ni borrado', async () => {
    await expect(luisExpenses.row('Supermercado E2E')).toContainText('80,00')
    await expect(luisExpenses.editLink('Supermercado E2E')).toHaveCount(0)
    await expect(luisExpenses.deleteButton('Supermercado E2E')).toHaveCount(0)
  })
})
