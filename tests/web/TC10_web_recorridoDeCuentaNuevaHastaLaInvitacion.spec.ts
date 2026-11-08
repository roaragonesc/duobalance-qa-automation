import { expect, test } from '../../src/fixtures'
import testData from '../../src/data/testData/web/TC10_web_recorridoDeCuentaNuevaHastaLaInvitacion.json'
import { defineCaseData } from '../../src/utils/caseData'

const data = defineCaseData(testData)
test.use({ caseData: data.setup })

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
    await loginPage.signIn(data.setup.journeyUsers.a.email, data.setup.journeyUsers.a.password)
    await onboardingPage.expectOpen()
    await expect(onboardingPage.heading).toBeVisible()
  })

  await test.step('2. El usuario recarga el onboarding y conserva la sesión', async () => {
    await onboardingPage.reload()
    await onboardingPage.expectOpen()
    await expect(demoPanel.userSelect).not.toHaveValue(data.expected.toHaveValue)
  })

  await test.step('3. El usuario crea el hogar al 50/50 y lo ve en su espacio', async () => {
    await onboardingPage.createSpace(data.inputs.createSpace, data.inputs.splitMethod)
    await expect(page).toHaveURL(/\/onboarding\/invite$/)
    await spacePage.visit()
    await expect(spacePage.heading(data.expected.heading)).toBeVisible()
    await expect(spacePage.summary).toContainText(data.expected.toContainText)
  })

  await test.step('4. El usuario genera la invitación para el segundo usuario', async () => {
    await onboardingPage.visitInvitation()
    await onboardingPage.invite(data.setup.journeyUsers.b.email)
    await expect(onboardingPage.invitationLink).toHaveValue(/\/join\?token=/)
  })

  await test.step('5. El usuario recarga el espacio, conserva el hogar y no puede crear otro', async () => {
    await spacePage.visit()
    await spacePage.reload()
    await expect(spacePage.heading(data.expected.heading)).toBeVisible()
    await onboardingPage.visit()
    await dashboardPage.expectOpen()
    await expect(onboardingPage.spaceNameField).toHaveCount(data.expected.toHaveCount)
  })

  await test.step('6. El usuario cierra sesión desde su perfil y vuelve al login', async () => {
    await profilePage.signOut()
    await loginPage.expectOpen()
    await expect(onboardingPage.heading).toHaveCount(data.expected.toHaveCount)
  })
})
