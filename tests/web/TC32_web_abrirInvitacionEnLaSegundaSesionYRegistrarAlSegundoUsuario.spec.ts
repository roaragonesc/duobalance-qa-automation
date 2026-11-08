import { expect, test } from '../../src/fixtures'
import { DemoPanel } from '../../src/components/DemoPanel'
import { journeyUsers } from '../../src/data/journeyUsers'
import { JoinSpacePage } from '../../src/pages/JoinSpacePage'
import { RegisterPage } from '../../src/pages/RegisterPage'
import { DashboardPage } from '../../src/pages/DashboardPage'
import { ProfilePage } from '../../src/pages/ProfilePage'

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
    await expect(anaProfile.nameHeading(journeyUsers.a.name)).toBeVisible()
    await expect(anaProfile.emailText(journeyUsers.a.email)).toBeVisible()
  })

  await test.step('2. Ana invita a Luis y obtiene el enlace de invitación', async () => {
    await onboardingPage.invite(journeyUsers.b.email)
    invitation = await onboardingPage.invitationLink.inputValue()
  })

  await test.step('3. Luis abre la invitación sin sesión iniciada', async () => {
    await luisJoin.open(invitation)
    await expect(luisJoin.createAccountLink).toBeVisible()
    await expect(luisDemoPanel.userSelect).toHaveValue('')
  })

  await test.step('4. Luis se registra desde la invitación', async () => {
    await luisJoin.createAccountLink.click()
    await luisRegister.register(journeyUsers.b)
    await expect(luisRegister.status).toContainText('Te hemos enviado un correo')
  })

  await test.step('5. Luis confirma su correo y acepta la invitación', async () => {
    await luisRegister.confirm(journeyUsers.b.email)
    await expect(luisJoin.acceptButton).toBeVisible()
    await luisJoin.accept()
    await luisDashboard.expectOpen()
  })

  await test.step('6. Luis abre su perfil y comprueba que es Luis', async () => {
    await luisProfile.visit()
    await expect(luisProfile.nameHeading(journeyUsers.b.name)).toBeVisible()
    await expect(luisProfile.emailText(journeyUsers.b.email)).toBeVisible()
  })
})
