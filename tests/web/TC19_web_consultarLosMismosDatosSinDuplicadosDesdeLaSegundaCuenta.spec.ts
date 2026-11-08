import { expect, test } from '../../src/fixtures'

import { ExpensesPage } from '../../src/pages/ExpensesPage'
import { ProfilePage } from '../../src/pages/ProfilePage'
import testData from '../../src/data/testData/web/TC19_web_consultarLosMismosDatosSinDuplicadosDesdeLaSegundaCuenta.json' with { type: 'json' }
import { defineCaseData } from '../../src/utils/caseData'

const data = defineCaseData(testData)
test.use({ caseData: data.setup })

// Requiere API real: necesita dos sesiones con datos compartidos y no se puede probar en modo mock.
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC19_web_consultarLosMismosDatosSinDuplicadosDesdeLaSegundaCuenta', async ({
  sharedExpense: _shared,
  partnerPage,
}) => {
  const luisProfile = new ProfilePage(partnerPage)
  const luisExpenses = new ExpensesPage(partnerPage)

  await test.step('1. Luis abre su perfil y comprueba que es Luis', async () => {
    await luisProfile.visit()
    await expect(luisProfile.nameHeading(data.setup.journeyUsers.b.name)).toBeVisible()
    await expect(luisProfile.emailText(data.setup.journeyUsers.b.email)).toBeVisible()
  })

  await test.step('2. Luis abre la lista de gastos', async () => {
    await luisExpenses.visit()
  })

  await test.step('3. Luis ve el gasto compartido de Ana una sola vez', async () => {
    await expect(luisExpenses.row(data.expected.row)).toHaveCount(data.expected.toHaveCount)
    await expect(luisExpenses.row(data.expected.row)).toContainText(data.expected.toContainText)
    await expect(luisExpenses.row(data.expected.row)).toContainText(data.expected.toContainText1)
    await expect(luisExpenses.cell(data.expected.cell, data.expected.cell2)).toBeVisible()
  })
})
