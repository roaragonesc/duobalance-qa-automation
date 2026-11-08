import { expect, test } from '../../src/fixtures'
import { journeyUsers } from '../../src/data/journeyUsers'

test('TC10_web_recorridoDeCuentaNuevaHastaLaInvitacion', async ({
  anaAccount: _ana,
  page,
  demoPanel,
  loginPage,
  onboardingPage,
  dashboardPage,
  spacePage,
  profilePage,
}) => {
  await test.step('1. El usuario sin espacio inicia sesión y llega al onboarding', async () => {
    await loginPage.signIn(journeyUsers.a.email, journeyUsers.a.password)
    await onboardingPage.expectOpen()
    await expect(onboardingPage.heading).toBeVisible()
  })

  await test.step('2. El usuario recarga el onboarding y conserva la sesión', async () => {
    await onboardingPage.reload()
    await onboardingPage.expectOpen()
    await expect(demoPanel.userSelect).not.toHaveValue('')
  })

  await test.step('3. El usuario crea el hogar al 50/50 y lo ve en su espacio', async () => {
    await onboardingPage.createSpace('Hogar E2E', 'equal')
    await expect(page).toHaveURL(/\/onboarding\/invite$/)
    await spacePage.visit()
    await expect(spacePage.heading('Hogar E2E')).toBeVisible()
    await expect(spacePage.summary).toContainText('1 de 2')
  })

  await test.step('4. El usuario genera la invitación para el segundo usuario', async () => {
    await onboardingPage.visitInvitation()
    await onboardingPage.invite(journeyUsers.b.email)
    await expect(onboardingPage.invitationLink).toHaveValue(/\/join\?token=/)
  })

  await test.step('5. El usuario recarga el espacio, conserva el hogar y no puede crear otro', async () => {
    await spacePage.visit()
    await spacePage.reload()
    await expect(spacePage.heading('Hogar E2E')).toBeVisible()
    await onboardingPage.visit()
    await dashboardPage.expectOpen()
    await expect(onboardingPage.spaceNameField).toHaveCount(0)
  })

  await test.step('6. El usuario cierra sesión desde su perfil y vuelve al login', async () => {
    await profilePage.signOut()
    await loginPage.expectOpen()
    await expect(onboardingPage.heading).toHaveCount(0)
  })
})
