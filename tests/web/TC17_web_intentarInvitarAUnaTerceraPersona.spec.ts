import { expect, test } from '../../src/fixtures'
import { OnboardingPage } from '../../src/pages/OnboardingPage'

test('TC17_web_intentarInvitarAUnaTerceraPersona', async ({ demoMember: _member, page }) => {
  const onboarding = new OnboardingPage(page)
  await onboarding.visitInvitation()
  await onboarding.invite('tercero.e2e@example.test')
  await expect(onboarding.alert).toHaveText('Este espacio ya tiene dos miembros.')
})
