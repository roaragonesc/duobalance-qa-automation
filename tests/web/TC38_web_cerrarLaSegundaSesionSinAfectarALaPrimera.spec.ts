import { expect, test } from '../../src/fixtures'

import { ExpensesPage } from '../../src/pages/ExpensesPage'
import { LoginPage } from '../../src/pages/LoginPage'
import { ProfilePage } from '../../src/pages/ProfilePage'
import testData from '../../src/data/testData/web/TC38_web_cerrarLaSegundaSesionSinAfectarALaPrimera.json' with { type: 'json' }
import { defineCaseData } from '../../src/utils/caseData'

const data = defineCaseData(testData)
test.use({ caseData: data.setup })

// Requiere API real: necesita dos sesiones con datos compartidos y no se puede probar en modo mock.
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC38_web_cerrarLaSegundaSesionSinAfectarALaPrimera', async ({
  balancedExpenses: _expenses,
  page,
  partnerPage,
  expensesPage: anaExpenses,
}) => {
  const anaProfile = new ProfilePage(page)
  const luisProfile = new ProfilePage(partnerPage)
  const luisExpenses = new ExpensesPage(partnerPage)
  const luisLogin = new LoginPage(partnerPage)

  await test.step('1. Ana abre su perfil y comprueba que es Ana', async () => {
    await anaProfile.visit()
    await expect(anaProfile.nameHeading(data.setup.journeyUsers.a.name)).toBeVisible()
    await expect(anaProfile.emailText(data.setup.journeyUsers.a.email)).toBeVisible()
  })

  await test.step('2. Luis abre su perfil y comprueba que es Luis', async () => {
    await luisProfile.visit()
    await expect(luisProfile.nameHeading(data.setup.journeyUsers.b.name)).toBeVisible()
    await expect(luisProfile.emailText(data.setup.journeyUsers.b.email)).toBeVisible()
  })

  await test.step('3. Luis cierra sesión desde su perfil', async () => {
    await luisProfile.signOut()
    await luisLogin.expectOpen()
  })

  await test.step('4. Luis intenta abrir los gastos y se le exige autenticación', async () => {
    await luisExpenses.visit()
    await luisLogin.expectOpen()
  })

  await test.step('5. Ana mantiene su sesión y ve todos sus gastos', async () => {
    await anaExpenses.visit()
    await expect(anaExpenses.row(data.expected.row)).toContainText(data.expected.toContainText)
    await expect(anaExpenses.row(data.expected.row1)).toContainText(data.expected.toContainText2)
    await expect(anaExpenses.row(data.expected.row3)).toContainText(data.expected.toContainText4)
  })
})
