import { expect, test } from '../../src/fixtures'

import { ProfilePage } from '../../src/pages/ProfilePage'
import { SpacePage } from '../../src/pages/SpacePage'
import testData from '../../src/data/testData/web/TC17_web_recargarAmbasSesionesIndependientes.json' with { type: 'json' }
import { defineCaseData } from '../../src/utils/caseData'

const data = defineCaseData(testData)
test.use({ caseData: data.setup })

// Requiere API real: necesita dos sesiones con datos compartidos y no se puede probar en modo mock.
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC17_web_recargarAmbasSesionesIndependientes', async ({ couple: _couple, page, partnerPage }) => {
  const anaProfile = new ProfilePage(page)
  const anaSpace = new SpacePage(page)
  const luisProfile = new ProfilePage(partnerPage)
  const luisSpace = new SpacePage(partnerPage)

  await test.step('1. Ana abre su perfil y comprueba que es Ana', async () => {
    await anaProfile.visit()
    await expect(anaProfile.nameHeading(data.setup.journeyUsers.a.name)).toBeVisible()
    await expect(anaProfile.emailText(data.setup.journeyUsers.a.email)).toBeVisible()
  })

  await test.step('2. Ana abre la pantalla del espacio', async () => {
    await anaSpace.visit()
  })

  await test.step('3. Ana recarga su sesión y sigue viendo el espacio completo', async () => {
    await anaSpace.reload()
    await expect(anaSpace.summary).toContainText(data.expected.toContainText)
  })

  await test.step('4. Ana conserva su propia identidad en la lista de miembros', async () => {
    await expect(anaSpace.member(data.setup.journeyUsers.a.email)).toBeVisible()
  })

  await test.step('5. Luis abre su perfil y comprueba que es Luis', async () => {
    await luisProfile.visit()
    await expect(luisProfile.nameHeading(data.setup.journeyUsers.b.name)).toBeVisible()
    await expect(luisProfile.emailText(data.setup.journeyUsers.b.email)).toBeVisible()
  })

  await test.step('6. Luis abre la pantalla del espacio', async () => {
    await luisSpace.visit()
  })

  await test.step('7. Luis recarga su sesión y sigue viendo el espacio completo', async () => {
    await luisSpace.reload()
    await expect(luisSpace.summary).toContainText(data.expected.toContainText)
  })

  await test.step('8. Luis conserva su propia identidad en la lista de miembros', async () => {
    await expect(luisSpace.member(data.setup.journeyUsers.b.email)).toBeVisible()
  })
})
