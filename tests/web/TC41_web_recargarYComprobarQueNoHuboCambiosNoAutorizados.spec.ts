import { expect, test } from '../../src/fixtures'

import { ExpensesPage } from '../../src/pages/ExpensesPage'
import { ProfilePage } from '../../src/pages/ProfilePage'
import testData from '../../src/data/testData/web/TC41_web_recargarYComprobarQueNoHuboCambiosNoAutorizados.json' with { type: 'json' }
import { defineCaseData } from '../../src/utils/caseData'

const data = defineCaseData(testData)
test.use({ caseData: data.setup })

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
    await expect(anaProfile.nameHeading(data.setup.journeyUsers.a.name)).toBeVisible()
    await expect(anaProfile.emailText(data.setup.journeyUsers.a.email)).toBeVisible()
  })

  await test.step('2. Ana abre la lista de gastos y ve el gasto compartido', async () => {
    await anaExpenses.visit()
    await expect(anaExpenses.row(data.expected.row)).toBeVisible()
  })

  await test.step('3. Ana recarga y el gasto compartido no ha cambiado', async () => {
    await anaExpenses.reload()
    await expect(anaExpenses.row(data.expected.row)).toContainText(data.expected.toContainText)
    await expect(anaExpenses.row(data.expected.row)).toHaveCount(data.expected.toHaveCount)
  })

  await test.step('4. Ana sigue viendo su gasto privado', async () => {
    await expect(anaExpenses.row(data.expected.row1)).toContainText(data.expected.toContainText2)
  })

  await test.step('5. Luis abre su perfil y comprueba que es Luis', async () => {
    await luisProfile.visit()
    await expect(luisProfile.nameHeading(data.setup.journeyUsers.b.name)).toBeVisible()
    await expect(luisProfile.emailText(data.setup.journeyUsers.b.email)).toBeVisible()
  })

  await test.step('6. Luis abre la lista de gastos y ve el gasto compartido', async () => {
    await luisExpenses.visit()
    await expect(luisExpenses.row(data.expected.row)).toBeVisible()
  })

  await test.step('7. Luis recarga y el gasto compartido no ha cambiado', async () => {
    await luisExpenses.reload()
    await expect(luisExpenses.row(data.expected.row)).toContainText(data.expected.toContainText)
    await expect(luisExpenses.row(data.expected.row)).toHaveCount(data.expected.toHaveCount)
  })

  await test.step('8. Luis sigue sin ver el gasto privado de Ana', async () => {
    await expect(luisExpenses.row(data.expected.row1)).toHaveCount(data.expected.toHaveCount3)
  })
})
