import { expect, test } from '../../src/fixtures'
import { demoUsers } from '../../src/data/demoUsers'
import { OnboardingPage } from '../../src/pages/OnboardingPage'

test('TC11_web_intentarInvitarAUnaTerceraPersona', async ({ demoMember: _member, page, profilePage }) => {
  const onboarding = new OnboardingPage(page)

  await test.step('1. Rocío abre su perfil y comprueba que es Rocío', async () => {
    await profilePage.visit()
    await expect(profilePage.nameHeading(demoUsers.rocio.name)).toBeVisible()
    await expect(profilePage.emailText(demoUsers.rocio.email)).toBeVisible()
  })

  await test.step('2. Rocío intenta invitar a una tercera persona a su espacio completo', async () => {
    await onboarding.visitInvitation()
    await onboarding.invite('tercero.e2e@example.test')
  })

  await test.step('3. Rocío ve el aviso de que el espacio ya tiene dos miembros', async () => {
    await expect(onboarding.alert).toHaveText('Este espacio ya tiene dos miembros.')
  })
})
