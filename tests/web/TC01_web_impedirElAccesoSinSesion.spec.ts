import { expect, test } from '../../src/fixtures'

test('TC01_web_impedirElAccesoSinSesion', async ({ expensesPage, loginPage }) => {
  await expensesPage.visit()
  await loginPage.expectOpen()
  await expect(expensesPage.heading).toHaveCount(0)
})
