import { expect, test } from '../../src/fixtures'
import { journeyUsers } from '../../src/data/journeyUsers'

const ana = journeyUsers.a

test('TC66_web_cerrarLaSesionSimuladaYEntrarConLaNuevaCuenta', async ({
  confirmedAna: _confirmed,
  demoPanel,
  loginPage,
  onboardingPage,
}) => {
  await demoPanel.selectUser(null)
  await loginPage.visit()
  await loginPage.signIn(ana.email, ana.password)
  await onboardingPage.expectOpen()
  await expect(onboardingPage.heading).toBeVisible()
})
