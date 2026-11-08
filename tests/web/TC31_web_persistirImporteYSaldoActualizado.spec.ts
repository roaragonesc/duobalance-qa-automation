import { expect, test } from '../../src/fixtures'

import { BalancePage } from '../../src/pages/BalancePage'
import { ExpensesPage } from '../../src/pages/ExpensesPage'
import { ProfilePage } from '../../src/pages/ProfilePage'
import testData from '../../src/data/testData/web/TC31_web_persistirImporteYSaldoActualizado.json'
import { defineCaseData } from '../../src/utils/caseData'

const data = defineCaseData(testData)
test.use({ caseData: data.setup })

// Requiere API real: necesita dos sesiones con datos compartidos y no se puede probar en modo mock.
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC31_web_persistirImporteYSaldoActualizado', async ({
  sharedExpense: _shared,
  page,
  partnerPage,
  expensesPage: anaExpenses,
}) => {
  const anaProfile = new ProfilePage(page)
  const anaBalance = new BalancePage(page)
  const luisProfile = new ProfilePage(partnerPage)
  const luisBalance = new BalancePage(partnerPage)
  const luisExpenses = new ExpensesPage(partnerPage)

  await test.step('1. Ana abre su perfil y comprueba que es Ana', async () => {
    await anaProfile.visit()
    await expect(anaProfile.nameHeading(data.setup.journeyUsers.a.name)).toBeVisible()
    await expect(anaProfile.emailText(data.setup.journeyUsers.a.email)).toBeVisible()
  })

  await test.step('2. Ana edita el importe de su gasto a 100 €', async () => {
    await anaExpenses.editAmount(data.inputs.editAmount, data.inputs.editAmount1)
  })

  await test.step('3. Ana abre el balance y ve el saldo actualizado', async () => {
    await anaBalance.visit()
    await expect(anaBalance.debtSummary).toContainText(data.expected.toContainText)
  })

  await test.step('4. Ana recarga el balance y el saldo persiste', async () => {
    await anaBalance.reload()
    await expect(anaBalance.debtSummary).toContainText(data.expected.toContainText)
  })

  await test.step('5. Ana abre la lista de gastos y ve el importe actualizado', async () => {
    await anaExpenses.visit()
    await expect(anaExpenses.row(data.expected.row)).toContainText(data.expected.toContainText2)
  })

  await test.step('6. Luis abre su perfil y comprueba que es Luis', async () => {
    await luisProfile.visit()
    await expect(luisProfile.nameHeading(data.setup.journeyUsers.b.name)).toBeVisible()
    await expect(luisProfile.emailText(data.setup.journeyUsers.b.email)).toBeVisible()
  })

  await test.step('7. Luis abre el balance y ve el saldo actualizado', async () => {
    await luisBalance.visit()
    await expect(luisBalance.debtSummary).toContainText(data.expected.toContainText)
  })

  await test.step('8. Luis recarga el balance y el saldo persiste', async () => {
    await luisBalance.reload()
    await expect(luisBalance.debtSummary).toContainText(data.expected.toContainText)
  })

  await test.step('9. Luis abre la lista de gastos y ve el importe actualizado', async () => {
    await luisExpenses.visit()
    await expect(luisExpenses.row(data.expected.row)).toContainText(data.expected.toContainText2)
  })
})
