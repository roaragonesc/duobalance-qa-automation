import { expect, test } from '../../src/fixtures'

import { ExpensesPage } from '../../src/pages/ExpensesPage'
import { ProfilePage } from '../../src/pages/ProfilePage'
import testData from '../../src/data/testData/web/TC39_web_mostrarSoloElGastoCompartidoSinAccionesAjenasEnLaSegundaCuenta.json' with { type: 'json' }
import { defineCaseData } from '../../src/utils/caseData'

const data = defineCaseData(testData)
test.use({ caseData: data.setup })

// Requiere API real: necesita dos sesiones con datos compartidos y no se puede probar en modo mock.
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC39_web_mostrarSoloElGastoCompartidoSinAccionesAjenasEnLaSegundaCuenta', async ({
  sharedAndPrivateExpenses: _expenses,
  partnerPage,
}) => {
  const luisProfile = new ProfilePage(partnerPage)
  const luisExpenses = new ExpensesPage(partnerPage)

  await test.step('1. Luis abre su perfil y comprueba que es Luis', async () => {
    await luisProfile.visit()
    await expect(luisProfile.nameHeading(data.setup.journeyUsers.b.name)).toBeVisible()
    await expect(luisProfile.emailText(data.setup.journeyUsers.b.email)).toBeVisible()
  })

  await test.step('2. Luis abre la lista de gastos y no ve el gasto privado de Ana', async () => {
    await luisExpenses.visit()
    await expect(luisExpenses.row(data.expected.row)).toHaveCount(data.expected.toHaveCount)
  })

  await test.step('3. Luis ve el gasto compartido sin acciones de edición ni borrado', async () => {
    await expect(luisExpenses.row(data.expected.row1)).toContainText(data.expected.toContainText)
    await expect(luisExpenses.editLink(data.expected.editLink)).toHaveCount(data.expected.toHaveCount)
    await expect(luisExpenses.deleteButton(data.expected.deleteButton)).toHaveCount(data.expected.toHaveCount)
  })
})
