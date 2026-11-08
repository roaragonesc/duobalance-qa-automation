import { expect, test } from '../../src/fixtures'
import testData from '../../src/data/testData/web/TC05_web_recorridoDeLoginIncorrecto.json'
import { defineCaseData } from '../../src/utils/caseData'

const data = defineCaseData(testData)
test.use({ caseData: data.setup })

const ana = data.setup.journeyUsers.a

test('TC05_web_recorridoDeLoginIncorrecto', async ({ anaAccount: _ana, demoPanel, loginPage, expensesPage }) => {
  await test.step('1. El usuario envía una contraseña incorrecta y ve el error conservando el correo', async () => {
    await loginPage.signIn(ana.email, data.inputs.signIn)
    await expect(loginPage.emailField).toHaveValue(ana.email)
    await expect(loginPage.alert).toHaveText(data.expected.invalidCredentialsMessage)
  })

  await test.step('2. El usuario intenta abrir una ruta privada y no accede', async () => {
    await expensesPage.visit()
    await loginPage.expectOpen()
    await expect(demoPanel.userSelect).toHaveValue(data.expected.toHaveValue)
  })
})
