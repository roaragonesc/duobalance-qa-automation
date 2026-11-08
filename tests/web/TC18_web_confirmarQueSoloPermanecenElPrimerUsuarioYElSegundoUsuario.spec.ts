import { expect, test } from '../../src/fixtures'
import { journeyUsers } from '../../src/data/journeyUsers'
import { OnboardingPage } from '../../src/pages/OnboardingPage'
import { ProfilePage } from '../../src/pages/ProfilePage'
import { SpacePage } from '../../src/pages/SpacePage'

// Requiere API real: necesita dos sesiones con datos compartidos y no se puede probar en modo mock.
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC18_web_confirmarQueSoloPermanecenElPrimerUsuarioYElSegundoUsuario', async ({
  couple: _couple,
  page,
  partnerPage,
}) => {
  const anaProfile = new ProfilePage(page)
  const anaOnboarding = new OnboardingPage(page)
  const anaSpace = new SpacePage(page)
  const luisProfile = new ProfilePage(partnerPage)
  const luisSpace = new SpacePage(partnerPage)

  await test.step('1. Ana abre su perfil y comprueba que es Ana', async () => {
    await anaProfile.visit()
    await expect(anaProfile.nameHeading(journeyUsers.a.name)).toBeVisible()
    await expect(anaProfile.emailText(journeyUsers.a.email)).toBeVisible()
  })

  await test.step('2. Ana intenta invitar a un tercer miembro y recibe un aviso', async () => {
    await anaOnboarding.visitInvitation()
    await anaOnboarding.invite('tercero.e2e@example.test')
    await expect(anaOnboarding.alert).toHaveText('Este espacio ya tiene dos miembros.')
  })

  await test.step('3. Ana comprueba que el espacio solo tiene dos miembros', async () => {
    await anaSpace.visit()
    await expect(anaSpace.summary).toContainText('2 de 2')
    await expect(anaSpace.memberItems).toHaveCount(2)
    await expect(anaSpace.members).not.toContainText('tercero')
  })

  await test.step('4. Luis abre su perfil y comprueba que es Luis', async () => {
    await luisProfile.visit()
    await expect(luisProfile.nameHeading(journeyUsers.b.name)).toBeVisible()
    await expect(luisProfile.emailText(journeyUsers.b.email)).toBeVisible()
  })

  await test.step('5. Luis comprueba que el espacio solo tiene dos miembros', async () => {
    await luisSpace.visit()
    await expect(luisSpace.summary).toContainText('2 de 2')
    await expect(luisSpace.memberItems).toHaveCount(2)
    await expect(luisSpace.members).not.toContainText('tercero')
  })
})
