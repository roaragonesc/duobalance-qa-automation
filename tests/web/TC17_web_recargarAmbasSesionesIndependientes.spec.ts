import { expect, test } from '../../src/fixtures'
import { journeyUsers } from '../../src/data/journeyUsers'
import { ProfilePage } from '../../src/pages/ProfilePage'
import { SpacePage } from '../../src/pages/SpacePage'

// Requiere API real: necesita dos sesiones con datos compartidos y no se puede probar en modo mock.
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC17_web_recargarAmbasSesionesIndependientes', async ({ couple: _couple, page, partnerPage }) => {
  const anaProfile = new ProfilePage(page)
  const anaSpace = new SpacePage(page)
  const luisProfile = new ProfilePage(partnerPage)
  const luisSpace = new SpacePage(partnerPage)

  await test.step('1. Ana abre su perfil y comprueba que es Ana', async () => {
    await anaProfile.visit()
    await expect(anaProfile.nameHeading(journeyUsers.a.name)).toBeVisible()
    await expect(anaProfile.emailText(journeyUsers.a.email)).toBeVisible()
  })

  await test.step('2. Ana abre la pantalla del espacio', async () => {
    await anaSpace.visit()
  })

  await test.step('3. Ana recarga su sesión y sigue viendo el espacio completo', async () => {
    await anaSpace.reload()
    await expect(anaSpace.summary).toContainText('2 de 2')
  })

  await test.step('4. Ana conserva su propia identidad en la lista de miembros', async () => {
    await expect(anaSpace.member(journeyUsers.a.email)).toBeVisible()
  })

  await test.step('5. Luis abre su perfil y comprueba que es Luis', async () => {
    await luisProfile.visit()
    await expect(luisProfile.nameHeading(journeyUsers.b.name)).toBeVisible()
    await expect(luisProfile.emailText(journeyUsers.b.email)).toBeVisible()
  })

  await test.step('6. Luis abre la pantalla del espacio', async () => {
    await luisSpace.visit()
  })

  await test.step('7. Luis recarga su sesión y sigue viendo el espacio completo', async () => {
    await luisSpace.reload()
    await expect(luisSpace.summary).toContainText('2 de 2')
  })

  await test.step('8. Luis conserva su propia identidad en la lista de miembros', async () => {
    await expect(luisSpace.member(journeyUsers.b.email)).toBeVisible()
  })
})
