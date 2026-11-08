import { expect, test } from '../../src/fixtures'

test('TC60_web_intentarAccesoPrivado', async ({ anaAccount: _ana, demoPanel, loginPage, expensesPage }) => {
  await expensesPage.visit()
  await loginPage.expectOpen()
  await expect(demoPanel.userSelect).toHaveValue('')
})
