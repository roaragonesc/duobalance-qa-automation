import { expect, test } from '../../src/fixtures'
import { journeyUsers } from '../../src/data/journeyUsers'

const ana = journeyUsers.a

test('TC07_web_recorridoDeAltaDeCuentaNueva', async ({ demoPanel, registerPage, loginPage, onboardingPage }) => {
  await test.step('1. El usuario se registra y recibe el enlace de confirmación', async () => {
    await registerPage.visit()
    await registerPage.register(ana)
    await expect(registerPage.status).toContainText('Te hemos enviado un correo')
    await expect(registerPage.confirmationLink(ana.email)).toBeVisible()
  })

  await test.step('2. El usuario confirma el correo simulado y llega al onboarding', async () => {
    await registerPage.confirm(ana.email)
    await onboardingPage.expectOpen()
  })

  await test.step('3. El usuario cierra la sesión simulada y entra con la cuenta nueva', async () => {
    await demoPanel.selectUser(null)
    await loginPage.visit()
    await loginPage.signIn(ana.email, ana.password)
    await onboardingPage.expectOpen()
    await expect(onboardingPage.heading).toBeVisible()
  })
})
