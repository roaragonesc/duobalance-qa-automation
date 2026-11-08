import { expect, test } from '../../src/fixtures'
import { journeyUsers } from '../../src/data/journeyUsers'

test('TC42_web_generarInvitacionAlSegundoUsuario', async ({
  spaceOwner: _owner, onboardingPage,
}) => {
  await onboardingPage.invite(journeyUsers.b.email)
  await expect(onboardingPage.invitationLink).toHaveValue(/\/join\?token=/)
})
