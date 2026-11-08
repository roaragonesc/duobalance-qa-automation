import { expect, test } from '../../src/fixtures'

import { ExpensesPage } from '../../src/pages/ExpensesPage'
import { ProfilePage } from '../../src/pages/ProfilePage'
import testData from '../../src/data/testData/web/TC21_web_recargarYComprobarPersistencia.json'
import { defineCaseData } from '../../src/utils/caseData'

const data = defineCaseData(testData)
test.use({ caseData: data.setup })

// Requiere API real: necesita dos sesiones con datos compartidos y no se puede probar en modo mock.
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC21_web_recargarYComprobarPersistencia', async ({ sharedExpense: _shared, page, partnerPage }) => {
  const anaProfile = new ProfilePage(page)
  const anaExpenses = new ExpensesPage(page)
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

  await test.step('3. Ana recarga y el gasto compartido persiste una sola vez', async () => {
    await anaExpenses.reload()
    await expect(anaExpenses.row(data.expected.row)).toHaveCount(data.expected.toHaveCount)
    await expect(anaExpenses.row(data.expected.row)).toContainText(data.expected.toContainText)
  })

  await test.step('4. Luis abre su perfil y comprueba que es Luis', async () => {
    await luisProfile.visit()
    await expect(luisProfile.nameHeading(data.setup.journeyUsers.b.name)).toBeVisible()
    await expect(luisProfile.emailText(data.setup.journeyUsers.b.email)).toBeVisible()
  })

  await test.step('5. Luis abre la lista de gastos y ve el gasto compartido', async () => {
    await luisExpenses.visit()
    await expect(luisExpenses.row(data.expected.row)).toBeVisible()
  })

  await test.step('6. Luis recarga y el gasto compartido persiste una sola vez', async () => {
    await luisExpenses.reload()
    await expect(luisExpenses.row(data.expected.row)).toHaveCount(data.expected.toHaveCount)
    await expect(luisExpenses.row(data.expected.row)).toContainText(data.expected.toContainText)
  })
})
