import { test, expect } from '../../src/fixtures/apiWeb'
import { DashboardPage } from '../../src/pages/DashboardPage'
import { JoinSpacePage } from '../../src/pages/JoinSpacePage'
import { OnboardingPage } from '../../src/pages/OnboardingPage'

test('TC08_web_e2e_vincularDosSesionesIndependientesConApi', async ({
  registeredPair: _registered, page, partnerPage, users,
}) => {
  const onboarding = new OnboardingPage(page)
  const partnerJoin = new JoinSpacePage(partnerPage)
  await onboarding.createSpace('Hogar E2E', 'equal')
  await expect(page).toHaveURL(/\/onboarding\/invite$/)
  await onboarding.invite(users.b.email)
  await expect(onboarding.invitationLink).toHaveValue(/\/join\?token=/)
  await partnerJoin.open(await onboarding.invitationLink.inputValue())
  await partnerJoin.accept()
  await new DashboardPage(partnerPage).expectOpen()
})
