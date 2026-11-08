import { expect, test } from '../../src/fixtures'

test('TC75_web_recargarYCerrarSesion', async ({
  signedInAna: _ana, page, demoPanel, loginPage, onboardingPage, dashboardPage, profilePage,
}) => {
  await onboardingPage.reload()
  await onboardingPage.expectOpen()
  await expect(demoPanel.userSelect).not.toHaveValue('')
  await onboardingPage.createSpace('Hogar E2E', 'equal')
  await expect(page).toHaveURL(/\/onboarding\/invite$/)
  await dashboardPage.visit()
  await profilePage.signOut()
  await loginPage.expectOpen()
  await expect(onboardingPage.heading).toHaveCount(0)
})
