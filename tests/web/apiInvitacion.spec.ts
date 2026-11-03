import { test, expect } from '../fixtures/apiWeb'
import { OnboardingPage } from '../pages/OnboardingPage'

test('TC29_vincularDosSesionesIndependientesConApi', async ({
  registeredPair: _registered, page, partnerPage, users,
}) => {
  await new OnboardingPage(page).createSpace('Hogar E2E', 'equal')
  await expect(page).toHaveURL(/\/onboarding\/invite$/)
  await new OnboardingPage(page).invite(users.b.email)
  await expect(page.getByLabel('Enlace de invitación')).toHaveValue(/\/join\?token=/)
  await partnerPage.goto(await page.getByLabel('Enlace de invitación').inputValue())
  await partnerPage.getByRole('button', { name: 'Aceptar invitación' }).click()
  await expect(partnerPage).toHaveURL(/\/dashboard$/)
})
