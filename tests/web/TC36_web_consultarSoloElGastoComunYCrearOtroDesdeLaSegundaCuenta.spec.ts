import { expect, test } from '../../src/fixtures'
import { journeyUsers } from '../../src/data/journeyUsers'
import { ExpensesPage } from '../../src/pages/ExpensesPage'
import { ProfilePage } from '../../src/pages/ProfilePage'

// Requiere API real: necesita dos sesiones con datos compartidos y no se puede probar en modo mock.
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC36_web_consultarSoloElGastoComunYCrearOtroDesdeLaSegundaCuenta', async ({
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

  await test.step('2. Luis abre la lista de gastos y solo ve el gasto común', async () => {
    await luisExpenses.visit()
    await expect(luisExpenses.row('Supermercado E2E')).toContainText('80,00')
    await expect(luisExpenses.row('Peluquería E2E')).toHaveCount(0)
  })

  await test.step('3. Luis filtra por gastos individuales y no ve el gasto privado de Ana', async () => {
    await luisExpenses.filterByType('individual')
    await expect(luisExpenses.row('Peluquería E2E')).toHaveCount(0)
  })

  await test.step('4. Luis crea un gasto compartido de 40 € y lo ve en la lista', async () => {
    await luisExpenses.filterByType('all')
    await luisExpenses.addExpense({ description: 'Gasolina E2E', amount: '40,00' })
    await expect(luisExpenses.row('Gasolina E2E')).toContainText('40,00')
  })
})
