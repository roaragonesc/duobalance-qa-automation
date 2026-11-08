import { expect, test } from '../../src/fixtures'
import { journeyUsers } from '../../src/data/journeyUsers'
import { ProfilePage } from '../../src/pages/ProfilePage'
import { SpacePage } from '../../src/pages/SpacePage'

// Requiere API real: necesita dos sesiones con datos compartidos y no se puede probar en modo mock.
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC16_web_consultarElMismoEspacioEnAmbosContextos', async ({ couple: _couple, page, partnerPage }) => {
  const anaProfile = new ProfilePage(page)
  const anaSpace = new SpacePage(page)
  const luisProfile = new ProfilePage(partnerPage)
  const luisSpace = new SpacePage(partnerPage)

  await test.step('1. Ana abre su perfil y comprueba que es Ana', async () => {
    await anaProfile.visit()
    await expect(anaProfile.nameHeading(journeyUsers.a.name)).toBeVisible()
    await expect(anaProfile.emailText(journeyUsers.a.email)).toBeVisible()
  })

  await test.step('2. Ana consulta el espacio Hogar E2E con ambos miembros', async () => {
    await anaSpace.visit()
    await expect(anaSpace.heading('Hogar E2E')).toBeVisible()
    await expect(anaSpace.members).toContainText('Ana')
    await expect(anaSpace.members).toContainText('Luis')
    await expect(anaSpace.summary).toContainText('2 de 2')
  })

  await test.step('3. Luis abre su perfil y comprueba que es Luis', async () => {
    await luisProfile.visit()
    await expect(luisProfile.nameHeading(journeyUsers.b.name)).toBeVisible()
    await expect(luisProfile.emailText(journeyUsers.b.email)).toBeVisible()
  })

  await test.step('4. Luis consulta el espacio Hogar E2E con ambos miembros', async () => {
    await luisSpace.visit()
    await expect(luisSpace.heading('Hogar E2E')).toBeVisible()
    await expect(luisSpace.members).toContainText('Ana')
    await expect(luisSpace.members).toContainText('Luis')
    await expect(luisSpace.summary).toContainText('2 de 2')
  })
})
