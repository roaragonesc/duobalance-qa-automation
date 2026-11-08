import { expect, test } from '../../src/fixtures'

import { ExpensesPage } from '../../src/pages/ExpensesPage'
import { ProfilePage } from '../../src/pages/ProfilePage'
import testData from '../../src/data/testData/web/TC30_web_abrirLaEdicionPorTecladoYModificarElGastoPropio.json'
import { defineCaseData } from '../../src/utils/caseData'

const data = defineCaseData(testData)
test.use({ caseData: data.setup })

// Requiere API real: necesita dos sesiones con datos compartidos y no se puede probar en modo mock.
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC30_web_abrirLaEdicionPorTecladoYModificarElGastoPropio', async ({
  sharedExpense: _shared,
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

  await test.step('2. Ana edita el importe de su gasto a 100 €', async () => {
    await anaExpenses.editAmount(data.inputs.editAmount, data.inputs.editAmount1)
    await expect(anaExpenses.row(data.expected.row)).toContainText(data.expected.toContainText)
  })

  await test.step('3. Luis abre su perfil y comprueba que es Luis', async () => {
    await luisProfile.visit()
    await expect(luisProfile.nameHeading(data.setup.journeyUsers.b.name)).toBeVisible()
    await expect(luisProfile.emailText(data.setup.journeyUsers.b.email)).toBeVisible()
  })

  await test.step('4. Luis abre la lista de gastos', async () => {
    await luisExpenses.visit()
  })

  await test.step('5. Luis recarga y ve el importe actualizado una sola vez', async () => {
    await luisExpenses.reload()
    await expect(luisExpenses.row(data.expected.row)).toContainText(data.expected.toContainText)
    await expect(luisExpenses.row(data.expected.row)).toHaveCount(data.expected.toHaveCount)
  })
})
