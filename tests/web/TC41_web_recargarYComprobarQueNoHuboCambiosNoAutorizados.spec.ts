import { expect, test } from '../../src/fixtures'
import { journeyUsers } from '../../src/data/journeyUsers'
import { ExpensesPage } from '../../src/pages/ExpensesPage'
import { ProfilePage } from '../../src/pages/ProfilePage'

// Requiere API real: necesita dos sesiones con datos compartidos y no se puede probar en modo mock.
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC41_web_recargarYComprobarQueNoHuboCambiosNoAutorizados', async ({
  sharedAndPrivateExpenses: _expenses,
  page,
  partnerPage,
  expensesPage: anaExpenses,
}) => {
  const anaProfile = new ProfilePage(page)
  const luisProfile = new ProfilePage(partnerPage)
  const luisExpenses = new ExpensesPage(partnerPage)

  await test.step('1. Ana abre su perfil y comprueba que es Ana', async () => {
    await anaProfile.visit()
    await expect(anaProfile.nameHeading(journeyUsers.a.name)).toBeVisible()
    await expect(anaProfile.emailText(journeyUsers.a.email)).toBeVisible()
  })

  await test.step('2. Ana abre la lista de gastos y ve el gasto compartido', async () => {
    await anaExpenses.visit()
    await expect(anaExpenses.row('Supermercado E2E')).toBeVisible()
  })

  await test.step('3. Ana recarga y el gasto compartido no ha cambiado', async () => {
    await anaExpenses.reload()
    await expect(anaExpenses.row('Supermercado E2E')).toContainText('80,00')
    await expect(anaExpenses.row('Supermercado E2E')).toHaveCount(1)
  })

  await test.step('4. Ana sigue viendo su gasto privado', async () => {
    await expect(anaExpenses.row('Peluquería E2E')).toContainText('35,00')
  })

  await test.step('5. Luis abre su perfil y comprueba que es Luis', async () => {
    await luisProfile.visit()
    await expect(luisProfile.nameHeading(journeyUsers.b.name)).toBeVisible()
    await expect(luisProfile.emailText(journeyUsers.b.email)).toBeVisible()
  })

  await test.step('6. Luis abre la lista de gastos y ve el gasto compartido', async () => {
    await luisExpenses.visit()
    await expect(luisExpenses.row('Supermercado E2E')).toBeVisible()
  })

  await test.step('7. Luis recarga y el gasto compartido no ha cambiado', async () => {
    await luisExpenses.reload()
    await expect(luisExpenses.row('Supermercado E2E')).toContainText('80,00')
    await expect(luisExpenses.row('Supermercado E2E')).toHaveCount(1)
  })

  await test.step('8. Luis sigue sin ver el gasto privado de Ana', async () => {
    await expect(luisExpenses.row('Peluquería E2E')).toHaveCount(0)
  })
})
