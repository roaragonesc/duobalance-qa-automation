import { expect, test } from '../../src/fixtures'
import { DashboardPage } from '../../src/pages/DashboardPage'
import { OnboardingPage } from '../../src/pages/OnboardingPage'
import { SpacePage } from '../../src/pages/SpacePage'

test('TC44_web_ambosConservanElMismoEspacioYNoPuedenCrearOtro', async ({
  couple: _couple, page, partnerPage,
}) => {
  for (const actor of [page, partnerPage]) {
    const space = new SpacePage(actor)
    await space.visit()
    await expect(space.heading('Hogar E2E')).toBeVisible()
    await space.reload()
    await expect(space.heading('Hogar E2E')).toBeVisible()
    await expect(space.members).toContainText('Ana')
    await expect(space.members).toContainText('Luis')
    await expect(space.summary).toContainText('2 de 2')
    await new OnboardingPage(actor).visit()
    await new DashboardPage(actor).expectOpen()
  }
})
