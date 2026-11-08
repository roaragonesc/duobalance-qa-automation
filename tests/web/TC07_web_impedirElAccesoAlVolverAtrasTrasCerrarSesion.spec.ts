import { expect, test } from '../../src/fixtures'
import { demoUsers } from '../../src/data/demoUsers'

test('TC07_web_impedirElAccesoAlVolverAtrasTrasCerrarSesion', async ({
  page, loginPage, expensesPage, profilePage,
}) => {
  await expensesPage.visit()
  await loginPage.expectOpen()
  await loginPage.signIn(demoUsers.rocio.email, demoUsers.rocio.password)
  await expensesPage.expectOpen()
  await expect(expensesPage.heading).toBeVisible()

  await profilePage.signOut()

  await loginPage.expectOpen()
  await page.goBack()
  await loginPage.expectOpen()
  await expect(expensesPage.heading).toHaveCount(0)
  await expensesPage.visit()
  await loginPage.expectOpen()
})
