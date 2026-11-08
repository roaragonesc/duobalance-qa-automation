import { expect, test } from '../../src/fixtures'
import { journeyUsers } from '../../src/data/journeyUsers'
import { ExpensesPage } from '../../src/pages/ExpensesPage'
import { ProfilePage } from '../../src/pages/ProfilePage'

// Requiere API real: necesita dos sesiones con datos compartidos y no se puede probar en modo mock.
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC24_web_denegarAccesoDirectoAlGastoPrivadoDesdeLaSegundaCuenta', async ({
  privateExpense: _expense,
  page,
  partnerPage,
  expensesPage: anaExpenses,
}) => {
  const anaProfile = new ProfilePage(page)
  const luisProfile = new ProfilePage(partnerPage)
  const luisExpenses = new ExpensesPage(partnerPage)
  let editUrl = ''

  await test.step('1. Ana abre su perfil y comprueba que es Ana', async () => {
    await anaProfile.visit()
    await expect(anaProfile.nameHeading(journeyUsers.a.name)).toBeVisible()
    await expect(anaProfile.emailText(journeyUsers.a.email)).toBeVisible()
  })

  await test.step('2. Ana obtiene el enlace de edición de su gasto privado', async () => {
    editUrl = await anaExpenses.editUrl('Peluquería E2E')
  })

  await test.step('3. Luis abre su perfil y comprueba que es Luis', async () => {
    await luisProfile.visit()
    await expect(luisProfile.nameHeading(journeyUsers.b.name)).toBeVisible()
    await expect(luisProfile.emailText(journeyUsers.b.email)).toBeVisible()
  })

  await test.step('4. Luis abre el enlace de edición y se le deniega el acceso', async () => {
    await luisExpenses.openEditor(editUrl)
    await expect(luisExpenses.alert).toHaveText(luisExpenses.permissionDeniedMessage)
    await expect(luisExpenses.conceptField).toHaveCount(0)
  })
})
