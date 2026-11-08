import { expect, test } from '../../src/fixtures'

test('TC19_web_crearHogarE2EAl5050', async ({
  signedInAna: _ana, page, onboardingPage, spacePage,
}) => {
  await onboardingPage.createSpace('Hogar E2E', 'equal')
  await expect(page).toHaveURL(/\/onboarding\/invite$/)
  await spacePage.visit()
  await expect(spacePage.heading('Hogar E2E')).toBeVisible()
  await expect(spacePage.summary).toContainText('1 de 2')
})
