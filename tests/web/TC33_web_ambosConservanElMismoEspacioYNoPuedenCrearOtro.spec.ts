import { expect, test } from '../../src/fixtures'
import { journeyUsers } from '../../src/data/journeyUsers'
import { DashboardPage } from '../../src/pages/DashboardPage'
import { OnboardingPage } from '../../src/pages/OnboardingPage'
import { ProfilePage } from '../../src/pages/ProfilePage'
import { SpacePage } from '../../src/pages/SpacePage'

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
    await expect(anaProfile.nameHeading(journeyUsers.a.name)).toBeVisible()
    await expect(anaProfile.emailText(journeyUsers.a.email)).toBeVisible()
  })

  await test.step('2. Ana abre el espacio y lo ve completo', async () => {
    await anaSpace.visit()
    await expect(anaSpace.heading('Hogar E2E')).toBeVisible()
  })

  await test.step('3. Ana recarga y conserva el mismo espacio', async () => {
    await anaSpace.reload()
    await expect(anaSpace.heading('Hogar E2E')).toBeVisible()
    await expect(anaSpace.members).toContainText('Ana')
    await expect(anaSpace.members).toContainText('Luis')
    await expect(anaSpace.summary).toContainText('2 de 2')
  })

  await test.step('4. Ana intenta crear otro espacio y vuelve al panel', async () => {
    await anaOnboarding.visit()
    await anaDashboard.expectOpen()
  })

  await test.step('5. Luis abre su perfil y comprueba que es Luis', async () => {
    await luisProfile.visit()
    await expect(luisProfile.nameHeading(journeyUsers.b.name)).toBeVisible()
    await expect(luisProfile.emailText(journeyUsers.b.email)).toBeVisible()
  })

  await test.step('6. Luis abre el espacio y lo ve completo', async () => {
    await luisSpace.visit()
    await expect(luisSpace.heading('Hogar E2E')).toBeVisible()
  })

  await test.step('7. Luis recarga y conserva el mismo espacio', async () => {
    await luisSpace.reload()
    await expect(luisSpace.heading('Hogar E2E')).toBeVisible()
    await expect(luisSpace.members).toContainText('Ana')
    await expect(luisSpace.members).toContainText('Luis')
    await expect(luisSpace.summary).toContainText('2 de 2')
  })

  await test.step('8. Luis intenta crear otro espacio y vuelve al panel', async () => {
    await luisOnboarding.visit()
    await luisDashboard.expectOpen()
  })
})
