import { expect, test } from '../../src/fixtures'
import { journeyUsers } from '../../src/data/journeyUsers'

test('TC41_web_iniciarSesionComoElPrimerUsuarioYCrearHogarE2E', async ({
  anaAccount: _ana, page, loginPage, onboardingPage,
}) => {
  await loginPage.visit()
  await loginPage.signIn(journeyUsers.a.email, journeyUsers.a.password)
  await onboardingPage.expectOpen()
  await onboardingPage.createSpace('Hogar E2E', 'equal')
  await expect(page).toHaveURL(/\/onboarding\/invite$/)
})
