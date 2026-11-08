import { expect, test } from '../../src/fixtures'
import { journeyUsers } from '../../src/data/journeyUsers'
import { ExpensesPage } from '../../src/pages/ExpensesPage'
import { ProfilePage } from '../../src/pages/ProfilePage'

// Requiere API real: necesita dos sesiones con datos compartidos y no se puede probar en modo mock.
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC25_web_conservarElGastoPropioSinRevelarloMedianteFiltrosALaOtraCuenta', async ({
  privateExpense: _expense,
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

  await test.step('2. Ana abre su lista de gastos y ve su gasto privado', async () => {
    await anaExpenses.visit()
    await expect(anaExpenses.row('Peluquería E2E')).toBeVisible()
  })

  await test.step('3. Ana recarga y su gasto privado persiste una sola vez', async () => {
    await anaExpenses.reload()
    await expect(anaExpenses.row('Peluquería E2E')).toHaveCount(1)
    await expect(anaExpenses.row('Peluquería E2E')).toContainText('35,00')
  })

  await test.step('4. Ana crea un gasto compartido de control de 2 €', async () => {
    // A shared control expense makes the filter controls available in Luis's list.
    await anaExpenses.addExpense({ description: 'Control compartido', amount: '2,00' })
  })

  await test.step('5. Luis abre su perfil y comprueba que es Luis', async () => {
    await luisProfile.visit()
    await expect(luisProfile.nameHeading(journeyUsers.b.name)).toBeVisible()
    await expect(luisProfile.emailText(journeyUsers.b.email)).toBeVisible()
  })

  await test.step('6. Luis abre la lista de gastos y ve el gasto de control', async () => {
    await luisExpenses.visit()
    await expect(luisExpenses.row('Control compartido')).toBeVisible()
  })

  await test.step('7. Luis filtra por gastos individuales y no ve el gasto privado de Ana', async () => {
    await luisExpenses.filterByType('individual')
    await expect(luisExpenses.row('Peluquería E2E')).toHaveCount(0)
    await expect(luisExpenses.individualTotal).toContainText('0,00')
  })

  await test.step('8. Luis filtra por gastos compartidos de alimentación y no ve el gasto privado de Ana', async () => {
    await luisExpenses.filterByType('shared')
    await luisExpenses.filterByCategory('food')
    await expect(luisExpenses.row('Control compartido')).toBeVisible()
    await expect(luisExpenses.row('Peluquería E2E')).toHaveCount(0)
  })
})
