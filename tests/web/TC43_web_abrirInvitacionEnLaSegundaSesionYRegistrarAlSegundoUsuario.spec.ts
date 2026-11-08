import { expect, test } from '../../src/fixtures'
import { DemoPanel } from '../../src/components/DemoPanel'
import { journeyUsers } from '../../src/data/journeyUsers'
import { JoinSpacePage } from '../../src/pages/JoinSpacePage'
import { RegisterPage } from '../../src/pages/RegisterPage'
import { DashboardPage } from '../../src/pages/DashboardPage'

test('TC43_web_abrirInvitacionEnLaSegundaSesionYRegistrarAlSegundoUsuario', async ({
  spaceOwner: _owner, partnerPage, onboardingPage,
}) => {
  await onboardingPage.invite(journeyUsers.b.email)
  const invitation = await onboardingPage.invitationLink.inputValue()

  const partnerJoin = new JoinSpacePage(partnerPage)
  const partnerRegister = new RegisterPage(partnerPage)
  await partnerJoin.open(invitation)
  await expect(partnerJoin.createAccountLink).toBeVisible()
  await expect(new DemoPanel(partnerPage).userSelect).toHaveValue('')
  await partnerJoin.createAccountLink.click()
  await partnerRegister.register(journeyUsers.b)
  await expect(partnerRegister.status).toContainText('Te hemos enviado un correo')
  await partnerRegister.confirm(journeyUsers.b.email)
  await expect(partnerJoin.acceptButton).toBeVisible()
  await partnerJoin.accept()
  await new DashboardPage(partnerPage).expectOpen()
})
