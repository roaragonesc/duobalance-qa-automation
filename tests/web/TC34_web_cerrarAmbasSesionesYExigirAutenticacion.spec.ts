import { expect, test } from '../../src/fixtures'

import { DashboardPage } from '../../src/pages/DashboardPage'
import { ExpensesPage } from '../../src/pages/ExpensesPage'
import { LoginPage } from '../../src/pages/LoginPage'
import { ProfilePage } from '../../src/pages/ProfilePage'
import testData from '../../src/data/testData/web/TC34_web_cerrarAmbasSesionesYExigirAutenticacion.json'
import { defineCaseData } from '../../src/utils/caseData'

const data = defineCaseData(testData)
test.use({ caseData: data.setup })

// Requiere API real: necesita dos sesiones con datos compartidos y no se puede probar en modo mock.
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC34_web_cerrarAmbasSesionesYExigirAutenticacion', async ({ couple: _couple, page, partnerPage }) => {
  const anaProfile = new ProfilePage(page)
  const anaDashboard = new DashboardPage(page)
  const anaLogin = new LoginPage(page)
  const anaExpenses = new ExpensesPage(page)
  const luisProfile = new ProfilePage(partnerPage)
  const luisDashboard = new DashboardPage(partnerPage)
  const luisLogin = new LoginPage(partnerPage)
  const luisExpenses = new ExpensesPage(partnerPage)

  await test.step('1. Ana abre su perfil y comprueba que es Ana', async () => {
    await anaProfile.visit()
    await expect(anaProfile.nameHeading(data.setup.journeyUsers.a.name)).toBeVisible()
    await expect(anaProfile.emailText(data.setup.journeyUsers.a.email)).toBeVisible()
  })

  await test.step('2. Ana cierra sesión desde su perfil', async () => {
    await anaDashboard.visit()
    await anaProfile.signOut()
    await anaLogin.expectOpen()
  })

  await test.step('3. Ana intenta abrir los gastos y se le exige autenticación', async () => {
    await anaExpenses.visit()
    await anaLogin.expectOpen()
  })

  await test.step('4. Luis abre su perfil y comprueba que es Luis', async () => {
    await luisProfile.visit()
    await expect(luisProfile.nameHeading(data.setup.journeyUsers.b.name)).toBeVisible()
    await expect(luisProfile.emailText(data.setup.journeyUsers.b.email)).toBeVisible()
  })

  await test.step('5. Luis cierra sesión desde su perfil', async () => {
    await luisDashboard.visit()
    await luisProfile.signOut()
    await luisLogin.expectOpen()
  })

  await test.step('6. Luis intenta abrir los gastos y se le exige autenticación', async () => {
    await luisExpenses.visit()
    await luisLogin.expectOpen()
  })
})
