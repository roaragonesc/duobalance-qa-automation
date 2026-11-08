import { expect, test } from '../../src/fixtures'
import { journeyUsers } from '../../src/data/journeyUsers'
import { ExpensesPage } from '../../src/pages/ExpensesPage'
import { ProfilePage } from '../../src/pages/ProfilePage'

// Requiere API real: necesita dos sesiones con datos compartidos y no se puede probar en modo mock.
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC21_web_recargarYComprobarPersistencia', async ({ sharedExpense: _shared, page, partnerPage }) => {
  const anaProfile = new ProfilePage(page)
  const anaExpenses = new ExpensesPage(page)
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

  await test.step('3. Ana recarga y el gasto compartido persiste una sola vez', async () => {
    await anaExpenses.reload()
    await expect(anaExpenses.row('Supermercado E2E')).toHaveCount(1)
    await expect(anaExpenses.row('Supermercado E2E')).toContainText('80,00')
  })

  await test.step('4. Luis abre su perfil y comprueba que es Luis', async () => {
    await luisProfile.visit()
    await expect(luisProfile.nameHeading(journeyUsers.b.name)).toBeVisible()
    await expect(luisProfile.emailText(journeyUsers.b.email)).toBeVisible()
  })

  await test.step('5. Luis abre la lista de gastos y ve el gasto compartido', async () => {
    await luisExpenses.visit()
    await expect(luisExpenses.row('Supermercado E2E')).toBeVisible()
  })

  await test.step('6. Luis recarga y el gasto compartido persiste una sola vez', async () => {
    await luisExpenses.reload()
    await expect(luisExpenses.row('Supermercado E2E')).toHaveCount(1)
    await expect(luisExpenses.row('Supermercado E2E')).toContainText('80,00')
  })
})
