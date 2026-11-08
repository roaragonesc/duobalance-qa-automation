import { expect, test } from '../../src/fixtures'
import { DemoPanel } from '../../src/components/DemoPanel'

import { JoinSpacePage } from '../../src/pages/JoinSpacePage'
import { RegisterPage } from '../../src/pages/RegisterPage'
import { DashboardPage } from '../../src/pages/DashboardPage'
import { ProfilePage } from '../../src/pages/ProfilePage'
import testData from '../../src/data/testData/web/TC32_web_abrirInvitacionEnLaSegundaSesionYRegistrarAlSegundoUsuario.json'
import { defineCaseData } from '../../src/utils/caseData'

const data = defineCaseData(testData)
test.use({ caseData: data.setup })

// Requiere API real: necesita dos sesiones con datos compartidos y no se puede probar en modo mock.
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC32_web_abrirInvitacionEnLaSegundaSesionYRegistrarAlSegundoUsuario', async ({
  spaceOwner: _owner,
  page,
  partnerPage,
  onboardingPage,
}) => {
  const anaProfile = new ProfilePage(page)
  const luisJoin = new JoinSpacePage(partnerPage)
  const luisRegister = new RegisterPage(partnerPage)
  const luisDemoPanel = new DemoPanel(partnerPage)
  const luisDashboard = new DashboardPage(partnerPage)
  const luisProfile = new ProfilePage(partnerPage)
  let invitation = ''

  await test.step('1. Ana abre su perfil y comprueba que es Ana', async () => {
    await anaProfile.visit()
    await expect(anaProfile.nameHeading(data.setup.journeyUsers.a.name)).toBeVisible()
    await expect(anaProfile.emailText(data.setup.journeyUsers.a.email)).toBeVisible()
  })

  await test.step('2. Ana invita a Luis y obtiene el enlace de invitación', async () => {
    await onboardingPage.invite(data.setup.journeyUsers.b.email)
    invitation = await onboardingPage.invitationLink.inputValue()
  })

  await test.step('3. Luis abre la invitación sin sesión iniciada', async () => {
    await luisJoin.open(invitation)
    await expect(luisJoin.createAccountLink).toBeVisible()
    await expect(luisDemoPanel.userSelect).toHaveValue(data.expected.toHaveValue)
  })

  await test.step('4. Luis se registra desde la invitación', async () => {
    await luisJoin.createAccountLink.click()
    await luisRegister.register(data.setup.journeyUsers.b)
    await expect(luisRegister.status).toContainText(data.expected.toContainText)
  })

  await test.step('5. Luis confirma su correo y acepta la invitación', async () => {
    await luisRegister.confirm(data.setup.journeyUsers.b.email)
    await expect(luisJoin.acceptButton).toBeVisible()
    await luisJoin.accept()
    await luisDashboard.expectOpen()
  })

  await test.step('6. Luis abre su perfil y comprueba que es Luis', async () => {
    await luisProfile.visit()
    await expect(luisProfile.nameHeading(data.setup.journeyUsers.b.name)).toBeVisible()
    await expect(luisProfile.emailText(data.setup.journeyUsers.b.email)).toBeVisible()
  })
})
