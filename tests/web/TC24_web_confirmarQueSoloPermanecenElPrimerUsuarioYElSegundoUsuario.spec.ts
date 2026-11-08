import { expect, test } from '../../src/fixtures'
import { OnboardingPage } from '../../src/pages/OnboardingPage'
import { SpacePage } from '../../src/pages/SpacePage'

test('TC24_web_confirmarQueSoloPermanecenElPrimerUsuarioYElSegundoUsuario', async ({
  couple: _couple, page, partnerPage,
}) => {
  const onboarding = new OnboardingPage(page)
  await onboarding.visitInvitation()
  await onboarding.invite('tercero.e2e@example.test')
  await expect(onboarding.alert).toHaveText('Este espacio ya tiene dos miembros.')

  for (const actor of [page, partnerPage]) {
    const space = new SpacePage(actor)
    await space.visit()
    await expect(space.summary).toContainText('2 de 2')
    await expect(space.memberItems).toHaveCount(2)
    await expect(space.members).not.toContainText('tercero')
  }
})
