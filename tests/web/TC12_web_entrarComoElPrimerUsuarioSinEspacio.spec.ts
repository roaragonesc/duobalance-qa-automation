import { test } from '../../src/fixtures'
import { journeyUsers } from '../../src/data/journeyUsers'

test('TC12_web_entrarComoElPrimerUsuarioSinEspacio', async ({ anaAccount: _ana, loginPage, onboardingPage }) => {
  await loginPage.signIn(journeyUsers.a.email, journeyUsers.a.password)
  await onboardingPage.expectOpen()
})
