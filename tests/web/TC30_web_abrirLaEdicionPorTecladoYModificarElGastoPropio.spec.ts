import { expect, test } from '../../src/fixtures'
import { journeyUsers } from '../../src/data/journeyUsers'
import { ExpensesPage } from '../../src/pages/ExpensesPage'
import { ProfilePage } from '../../src/pages/ProfilePage'

// Requiere API real: necesita dos sesiones con datos compartidos y no se puede probar en modo mock.
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC30_web_abrirLaEdicionPorTecladoYModificarElGastoPropio', async ({
  sharedExpense: _shared,
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

  await test.step('2. Ana edita el importe de su gasto a 100 €', async () => {
    await anaExpenses.editAmount('Supermercado E2E', '100,00')
    await expect(anaExpenses.row('Supermercado E2E')).toContainText('100,00')
  })

  await test.step('3. Luis abre su perfil y comprueba que es Luis', async () => {
    await luisProfile.visit()
    await expect(luisProfile.nameHeading(journeyUsers.b.name)).toBeVisible()
    await expect(luisProfile.emailText(journeyUsers.b.email)).toBeVisible()
  })

  await test.step('4. Luis abre la lista de gastos', async () => {
    await luisExpenses.visit()
  })

  await test.step('5. Luis recarga y ve el importe actualizado una sola vez', async () => {
    await luisExpenses.reload()
    await expect(luisExpenses.row('Supermercado E2E')).toContainText('100,00')
    await expect(luisExpenses.row('Supermercado E2E')).toHaveCount(1)
  })
})
