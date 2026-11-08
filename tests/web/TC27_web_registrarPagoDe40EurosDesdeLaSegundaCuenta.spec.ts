import { expect, test } from '../../src/fixtures'
import { journeyUsers } from '../../src/data/journeyUsers'
import { ExpensesPage } from '../../src/pages/ExpensesPage'
import { ProfilePage } from '../../src/pages/ProfilePage'

// Requiere API real: necesita dos sesiones con datos compartidos y no se puede probar en modo mock.
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC27_web_registrarPagoDe40EurosDesdeLaSegundaCuenta', async ({ couple: _couple, partnerPage }) => {
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

  await test.step('3. Luis crea un gasto compartido de 40 € y lo ve en la lista', async () => {
    await luisExpenses.addExpense({ description: 'Gasolina E2E', amount: '40,00' })
    await expect(luisExpenses.row('Gasolina E2E')).toContainText('40,00')
  })
})
