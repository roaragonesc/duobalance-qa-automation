import { expect, test } from '../../src/fixtures'
import testData from '../../src/data/testData/web/TC01_web_recorridoDeAccesoProtegidoYCierreDeSesion.json' with { type: 'json' }
import { defineCaseData } from '../../src/utils/caseData'

const data = defineCaseData(testData)
test.use({ caseData: data.setup })

test('TC01_web_recorridoDeAccesoProtegidoYCierreDeSesion', async ({ page, loginPage, expensesPage, profilePage }) => {
  await test.step('1. El usuario abre una ruta privada sin sesión y es redirigido al login', async () => {
    await expensesPage.visit()
    await loginPage.expectOpen()
    await expect(expensesPage.heading).toHaveCount(data.expected.toHaveCount)
  })

  await test.step('2. El usuario inicia sesión y vuelve a la ruta privada solicitada', async () => {
    await loginPage.signIn(data.setup.demoUsers.rocio.email, data.setup.demoUsers.rocio.password)
    await expensesPage.expectOpen()
    await expect(expensesPage.heading).toBeVisible()
  })

  await test.step('3. El usuario cierra sesión desde su perfil y vuelve al login', async () => {
    await profilePage.signOut()
    await loginPage.expectOpen()
  })

  await test.step('4. El usuario vuelve atrás tras cerrar sesión y no accede a la ruta privada', async () => {
    await page.goBack()
    await loginPage.expectOpen()
    await expect(expensesPage.heading).toHaveCount(data.expected.toHaveCount)
    await expensesPage.visit()
    await loginPage.expectOpen()
  })
})
