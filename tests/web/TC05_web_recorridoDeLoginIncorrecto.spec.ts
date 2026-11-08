import { expect, test } from '../../src/fixtures'
import { journeyUsers } from '../../src/data/journeyUsers'

const ana = journeyUsers.a

test('TC05_web_recorridoDeLoginIncorrecto', async ({ anaAccount: _ana, demoPanel, loginPage, expensesPage }) => {
  await test.step('1. El usuario envía una contraseña incorrecta y ve el error conservando el correo', async () => {
    await loginPage.signIn(ana.email, 'Incorrecta123!')
    await expect(loginPage.emailField).toHaveValue(ana.email)
    await expect(loginPage.alert).toHaveText(loginPage.invalidCredentialsMessage)
  })

  await test.step('2. El usuario intenta abrir una ruta privada y no accede', async () => {
    await expensesPage.visit()
    await loginPage.expectOpen()
    await expect(demoPanel.userSelect).toHaveValue('')
  })
})
