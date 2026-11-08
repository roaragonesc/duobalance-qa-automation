import { test } from '../../src/fixtures'
import { journeyUsers } from '../../src/data/journeyUsers'

test('TC65_web_confirmarElCorreoSimulado', async ({ pendingAna: _pending, registerPage, onboardingPage }) => {
  await registerPage.confirm(journeyUsers.a.email)
  await onboardingPage.expectOpen()
})
