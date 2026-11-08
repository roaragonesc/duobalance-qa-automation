import { expect, test } from '../../src/fixtures'
import testData from '../../src/data/testData/web/TC06_web_recorridoDeValidacionDelRegistro.json'
import { defineCaseData } from '../../src/utils/caseData'

const data = defineCaseData(testData)
test.use({ caseData: data.setup })

const ana = data.setup.journeyUsers.a

test('TC06_web_recorridoDeValidacionDelRegistro', async ({ registerPage }) => {
  await test.step('1. El usuario registra contraseñas distintas y ve el error sin recibir confirmación', async () => {
    await registerPage.visit()
    await registerPage.register(ana, data.inputs.register)
    await expect(registerPage.confirmPasswordField).toHaveAccessibleDescription(
      data.expected.toHaveAccessibleDescription,
    )
    await expect(registerPage.confirmationLink(ana.email)).toHaveCount(data.expected.toHaveCount)
  })

  await test.step('2. El usuario corrige la confirmación, reenvía y recibe el enlace de confirmación', async () => {
    await registerPage.confirmPasswordField.fill(ana.password)
    await registerPage.submitButton.click()
    await expect(registerPage.confirmationLink(ana.email)).toBeVisible()
  })
})
