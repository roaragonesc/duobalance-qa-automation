import { expect, test } from '../../src/fixtures'

test('TC20_web_recargarYVolverAlOnboarding', async ({
  spaceOwner: _owner, onboardingPage, dashboardPage, spacePage,
}) => {
  await spacePage.visit()

  await spacePage.reload()
  await expect(spacePage.heading('Hogar E2E')).toBeVisible()
  await onboardingPage.visit()
  await dashboardPage.expectOpen()
  await expect(onboardingPage.spaceNameField).toHaveCount(0)
})
