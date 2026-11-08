import { expect, test } from '../../src/fixtures'
import { journeyUsers } from '../../src/data/journeyUsers'
import { BalancePage } from '../../src/pages/BalancePage'
import { ProfilePage } from '../../src/pages/ProfilePage'

// Requiere API real: necesita dos sesiones con datos compartidos y no se puede probar en modo mock.
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC28_web_verificarSaldoNetoYPersistenciaDesdeAmbasPerspectivas', async ({
  balancedExpenses: _expenses,
  page,
  partnerPage,
}) => {
  const anaProfile = new ProfilePage(page)
  const anaBalance = new BalancePage(page)
  const luisProfile = new ProfilePage(partnerPage)
  const luisBalance = new BalancePage(partnerPage)

  await test.step('1. Ana abre su perfil y comprueba que es Ana', async () => {
    await anaProfile.visit()
    await expect(anaProfile.nameHeading(journeyUsers.a.name)).toBeVisible()
    await expect(anaProfile.emailText(journeyUsers.a.email)).toBeVisible()
  })

  await test.step('2. Ana abre el balance y ve el saldo neto de 20 €', async () => {
    await anaBalance.visit()
    await expect(anaBalance.debtSummary).toContainText('20,00')
    await expect(anaBalance.monthSummary).toContainText('120,00')
  })

  await test.step('3. Ana recarga y el saldo neto persiste', async () => {
    await anaBalance.reload()
    await expect(anaBalance.debtSummary).toContainText('20,00')
  })

  await test.step('4. Ana ve que Luis le debe dinero', async () => {
    await expect(anaBalance.debtSummary).toContainText('Luis te debe')
  })

  await test.step('5. Luis abre su perfil y comprueba que es Luis', async () => {
    await luisProfile.visit()
    await expect(luisProfile.nameHeading(journeyUsers.b.name)).toBeVisible()
    await expect(luisProfile.emailText(journeyUsers.b.email)).toBeVisible()
  })

  await test.step('6. Luis abre el balance y ve el saldo neto de 20 €', async () => {
    await luisBalance.visit()
    await expect(luisBalance.debtSummary).toContainText('20,00')
    await expect(luisBalance.monthSummary).toContainText('120,00')
  })

  await test.step('7. Luis recarga y el saldo neto persiste', async () => {
    await luisBalance.reload()
    await expect(luisBalance.debtSummary).toContainText('20,00')
  })

  await test.step('8. Luis ve que debe dinero a Ana', async () => {
    await expect(luisBalance.debtSummary).toContainText('Tú debes a Ana')
  })
})
