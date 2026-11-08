import { expect, test } from '../../src/fixtures'
import testData from '../../src/data/testData/web/TC12_web_recorridoDeGastoCompartidoYBalanceEnLaDemo.json' with { type: 'json' }
import { defineCaseData } from '../../src/utils/caseData'

const data = defineCaseData(testData)
test.use({ caseData: data.setup })

test('TC12_web_recorridoDeGastoCompartidoYBalanceEnLaDemo', async ({
  demoMember: _member,
  navigation,
  profilePage,
  spacePage,
  expensesPage,
  balancePage,
}) => {
  const { shared } = data.setup.demoExpenses

  await test.step('1. Rocío abre su perfil y comprueba que es Rocío', async () => {
    await profilePage.visit()
    await expect(profilePage.nameHeading(data.setup.demoUsers.rocio.name)).toBeVisible()
    await expect(profilePage.emailText(data.setup.demoUsers.rocio.email)).toBeVisible()
  })

  await test.step('2. Rocío entra en su espacio y ve que lo comparte con su pareja', async () => {
    await navigation.open(data.inputs.section)
    await expect(spacePage.heading(data.expected.heading)).toBeVisible()
    await expect(spacePage.summary).toContainText(data.expected.toContainText)
  })

  await test.step('3. Rocío crea un gasto compartido de 80 €', async () => {
    await expensesPage.visit()
    await expensesPage.addExpense(shared)
    await expect(expensesPage.row(shared.description)).toHaveCount(data.expected.toHaveCount)
    await expect(expensesPage.row(shared.description)).toContainText(data.expected.toContainText1)
    await expect(expensesPage.row(shared.description)).toContainText(data.expected.toContainText2)
    await expect(expensesPage.cell(shared.description, data.expected.cell)).toBeVisible()
  })

  await test.step('4. Rocío comprueba el reparto exacto en el balance y su persistencia tras recargar', async () => {
    await navigation.open(data.inputs.sectionChoices.Balance.section)
    await expect(balancePage.monthSummary).toContainText(data.expected.toContainText3)
    await expect(balancePage.ownContribution).toContainText(data.expected.toContainText4)
    await expect(balancePage.monthBalance).toContainText(data.expected.toContainText5)
    await expect(balancePage.debtSummary).toContainText(data.expected.toContainText6)
    await balancePage.reload()
    await expect(balancePage.debtSummary).toContainText(data.expected.toContainText6)
  })

  await test.step('5. Rocío edita el importe del gasto a 100 € sin duplicarlo', async () => {
    await expensesPage.visit()
    await expensesPage.editAmount(shared.description, data.inputs.editAmount)
    await expensesPage.reload()
    await expect(expensesPage.row(shared.description)).toHaveCount(data.expected.toHaveCount)
    await expect(expensesPage.row(shared.description)).toContainText(data.expected.toContainText7)
  })

  await test.step('6. Rocío comprueba que el balance se recalcula con el importe editado', async () => {
    await navigation.open(data.inputs.sectionChoices.Balance.section)
    await expect(balancePage.monthSummary).toContainText(data.expected.toContainText8)
    await expect(balancePage.debtSummary).toContainText(data.expected.toContainText9)
  })
})
