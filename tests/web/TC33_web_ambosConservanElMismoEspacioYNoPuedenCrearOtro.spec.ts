import { expect, test } from '../../src/fixtures'

import { DashboardPage } from '../../src/pages/DashboardPage'
import { OnboardingPage } from '../../src/pages/OnboardingPage'
import { ProfilePage } from '../../src/pages/ProfilePage'
import { SpacePage } from '../../src/pages/SpacePage'
import testData from '../../src/data/testData/web/TC33_web_ambosConservanElMismoEspacioYNoPuedenCrearOtro.json' with { type: 'json' }
import { defineCaseData } from '../../src/utils/caseData'

const data = defineCaseData(testData)
test.use({ caseData: data.setup })

// Requiere API real: necesita dos sesiones con datos compartidos y no se puede probar en modo mock.
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC33_web_ambosConservanElMismoEspacioYNoPuedenCrearOtro', async ({ couple: _couple, page, partnerPage }) => {
  const anaProfile = new ProfilePage(page)
  const anaSpace = new SpacePage(page)
  const anaOnboarding = new OnboardingPage(page)
  const anaDashboard = new DashboardPage(page)
  const luisProfile = new ProfilePage(partnerPage)
  const luisSpace = new SpacePage(partnerPage)
  const luisOnboarding = new OnboardingPage(partnerPage)
  const luisDashboard = new DashboardPage(partnerPage)

  await test.step('1. Ana abre su perfil y comprueba que es Ana', async () => {
    await anaProfile.visit()
    await expect(anaProfile.nameHeading(data.setup.journeyUsers.a.name)).toBeVisible()
    await expect(anaProfile.emailText(data.setup.journeyUsers.a.email)).toBeVisible()
  })

  await test.step('2. Ana abre el espacio y lo ve completo', async () => {
    await anaSpace.visit()
    await expect(anaSpace.heading(data.expected.heading)).toBeVisible()
  })

  await test.step('3. Ana recarga y conserva el mismo espacio', async () => {
    await anaSpace.reload()
    await expect(anaSpace.heading(data.expected.heading)).toBeVisible()
    await expect(anaSpace.members).toContainText(data.expected.toContainText)
    await expect(anaSpace.members).toContainText(data.expected.toContainText1)
    await expect(anaSpace.summary).toContainText(data.expected.toContainText2)
  })

  await test.step('4. Ana intenta crear otro espacio y vuelve al panel', async () => {
    await anaOnboarding.visit()
    await anaDashboard.expectOpen()
  })

  await test.step('5. Luis abre su perfil y comprueba que es Luis', async () => {
    await luisProfile.visit()
    await expect(luisProfile.nameHeading(data.setup.journeyUsers.b.name)).toBeVisible()
    await expect(luisProfile.emailText(data.setup.journeyUsers.b.email)).toBeVisible()
  })

  await test.step('6. Luis abre el espacio y lo ve completo', async () => {
    await luisSpace.visit()
    await expect(luisSpace.heading(data.expected.heading)).toBeVisible()
  })

  await test.step('7. Luis recarga y conserva el mismo espacio', async () => {
    await luisSpace.reload()
    await expect(luisSpace.heading(data.expected.heading)).toBeVisible()
    await expect(luisSpace.members).toContainText(data.expected.toContainText)
    await expect(luisSpace.members).toContainText(data.expected.toContainText1)
    await expect(luisSpace.summary).toContainText(data.expected.toContainText2)
  })

  await test.step('8. Luis intenta crear otro espacio y vuelve al panel', async () => {
    await luisOnboarding.visit()
    await luisDashboard.expectOpen()
  })
})
