import { expect, test } from '../../src/fixtures'
import { demoUsers } from '../../src/data/demoUsers'

test('TC05_web_volverALaRutaPrivadaTrasIniciarSesion', async ({ loginPage, expensesPage }) => {
  await expensesPage.visit()
  await loginPage.expectOpen()

  await loginPage.signIn(demoUsers.rocio.email, demoUsers.rocio.password)

  await expensesPage.expectOpen()
  await expect(expensesPage.heading).toBeVisible()
})
