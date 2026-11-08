import { expect, test } from '../../src/fixtures'

import { OnboardingPage } from '../../src/pages/OnboardingPage'
import testData from '../../src/data/testData/web/TC11_web_intentarInvitarAUnaTerceraPersona.json' with { type: 'json' }
import { defineCaseData } from '../../src/utils/caseData'

const data = defineCaseData(testData)
test.use({ caseData: data.setup })

test('TC11_web_intentarInvitarAUnaTerceraPersona', async ({ demoMember: _member, page, profilePage }) => {
  const onboarding = new OnboardingPage(page)

  await test.step('1. Rocío abre su perfil y comprueba que es Rocío', async () => {
    await profilePage.visit()
    await expect(profilePage.nameHeading(data.setup.demoUsers.rocio.name)).toBeVisible()
    await expect(profilePage.emailText(data.setup.demoUsers.rocio.email)).toBeVisible()
  })

  await test.step('2. Rocío intenta invitar a una tercera persona a su espacio completo', async () => {
    await onboarding.visitInvitation()
    await onboarding.invite(data.inputs.invite)
  })

  await test.step('3. Rocío ve el aviso de que el espacio ya tiene dos miembros', async () => {
    await expect(onboarding.alert).toHaveText(data.expected.toHaveText)
  })
})
