import { expect, test } from '../../src/fixtures'

import { ExpensesPage } from '../../src/pages/ExpensesPage'
import { ProfilePage } from '../../src/pages/ProfilePage'
import testData from '../../src/data/testData/web/TC40_web_denegarEdicionDirectaDeAmbosGastos.json' with { type: 'json' }
import { defineCaseData } from '../../src/utils/caseData'

const data = defineCaseData(testData)
test.use({ caseData: data.setup })

// Requiere API real: necesita dos sesiones con datos compartidos y no se puede probar en modo mock.
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC40_web_denegarEdicionDirectaDeAmbosGastos', async ({
  sharedAndPrivateExpenses: _expenses,
  page,
  partnerPage,
  expensesPage: anaExpenses,
}) => {
  const anaProfile = new ProfilePage(page)
  const luisProfile = new ProfilePage(partnerPage)
  const luisExpenses = new ExpensesPage(partnerPage)
  let privateUrl = ''
  let sharedUrl = ''

  await test.step('1. Ana abre su perfil y comprueba que es Ana', async () => {
    await anaProfile.visit()
    await expect(anaProfile.nameHeading(data.setup.journeyUsers.a.name)).toBeVisible()
    await expect(anaProfile.emailText(data.setup.journeyUsers.a.email)).toBeVisible()
  })

  await test.step('2. Ana obtiene los enlaces de edición de sus dos gastos', async () => {
    privateUrl = await anaExpenses.editUrl(data.inputs.editUrl)
    sharedUrl = await anaExpenses.editUrl(data.inputs.editUrl1)
  })

  await test.step('3. Luis abre su perfil y comprueba que es Luis', async () => {
    await luisProfile.visit()
    await expect(luisProfile.nameHeading(data.setup.journeyUsers.b.name)).toBeVisible()
    await expect(luisProfile.emailText(data.setup.journeyUsers.b.email)).toBeVisible()
  })

  await test.step('4. Luis abre el enlace de edición del gasto privado y se le deniega el acceso', async () => {
    await luisExpenses.openEditor(privateUrl)
    await expect(luisExpenses.alert).toHaveText(data.expected.permissionDeniedMessage)
    await expect(luisExpenses.saveButton).toHaveCount(data.expected.toHaveCount)
  })

  await test.step('5. Luis abre el enlace de edición del gasto compartido y se le deniega el acceso', async () => {
    await luisExpenses.openEditor(sharedUrl)
    await expect(luisExpenses.alert).toHaveText(data.expected.permissionDeniedMessage)
    await expect(luisExpenses.saveButton).toHaveCount(data.expected.toHaveCount)
  })
})
