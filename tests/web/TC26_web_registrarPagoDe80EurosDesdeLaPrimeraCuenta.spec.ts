import { expect, test } from '../../src/fixtures'
import { journeyUsers } from '../../src/data/journeyUsers'
import { ProfilePage } from '../../src/pages/ProfilePage'

// Requiere API real: necesita dos sesiones con datos compartidos y no se puede probar en modo mock.
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC26_web_registrarPagoDe80EurosDesdeLaPrimeraCuenta', async ({
  couple: _couple,
  page,
  expensesPage: anaExpenses,
  balancePage: anaBalance,
}) => {
  const anaProfile = new ProfilePage(page)

  await test.step('1. Ana abre su perfil y comprueba que es Ana', async () => {
    await anaProfile.visit()
    await expect(anaProfile.nameHeading(journeyUsers.a.name)).toBeVisible()
    await expect(anaProfile.emailText(journeyUsers.a.email)).toBeVisible()
  })

  await test.step('2. Ana crea un gasto compartido de 80 €', async () => {
    await anaExpenses.addExpense({ description: 'Supermercado E2E', amount: '80,00' })
  })

  await test.step('3. Ana abre el balance y ve que Luis le debe 40 €', async () => {
    await anaBalance.visit()
    await expect(anaBalance.debtSummary).toContainText('Luis te debe')
    await expect(anaBalance.debtSummary).toContainText('40,00')
  })
})
