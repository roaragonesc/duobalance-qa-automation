import { expect, test } from '../../src/fixtures'

import { OnboardingPage } from '../../src/pages/OnboardingPage'
import { ProfilePage } from '../../src/pages/ProfilePage'
import { SpacePage } from '../../src/pages/SpacePage'
import testData from '../../src/data/testData/web/TC18_web_confirmarQueSoloPermanecenElPrimerUsuarioYElSegundoUsuario.json'
import { defineCaseData } from '../../src/utils/caseData'

const data = defineCaseData(testData)
test.use({ caseData: data.setup })

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
    await expect(anaProfile.nameHeading(data.setup.journeyUsers.a.name)).toBeVisible()
    await expect(anaProfile.emailText(data.setup.journeyUsers.a.email)).toBeVisible()
  })

  await test.step('2. Ana intenta invitar a un tercer miembro y recibe un aviso', async () => {
    await anaOnboarding.visitInvitation()
    await anaOnboarding.invite(data.inputs.invite)
    await expect(anaOnboarding.alert).toHaveText(data.expected.toHaveText)
  })

  await test.step('3. Ana comprueba que el espacio solo tiene dos miembros', async () => {
    await anaSpace.visit()
    await expect(anaSpace.summary).toContainText(data.expected.toContainText)
    await expect(anaSpace.memberItems).toHaveCount(data.expected.toHaveCount)
    await expect(anaSpace.members).not.toContainText(data.expected.toContainText1)
  })

  await test.step('4. Luis abre su perfil y comprueba que es Luis', async () => {
    await luisProfile.visit()
    await expect(luisProfile.nameHeading(data.setup.journeyUsers.b.name)).toBeVisible()
    await expect(luisProfile.emailText(data.setup.journeyUsers.b.email)).toBeVisible()
  })

  await test.step('5. Luis comprueba que el espacio solo tiene dos miembros', async () => {
    await luisSpace.visit()
    await expect(luisSpace.summary).toContainText(data.expected.toContainText)
    await expect(luisSpace.memberItems).toHaveCount(data.expected.toHaveCount)
    await expect(luisSpace.members).not.toContainText(data.expected.toContainText1)
  })
})
