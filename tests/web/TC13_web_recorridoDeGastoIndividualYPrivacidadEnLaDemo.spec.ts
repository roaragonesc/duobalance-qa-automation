import { expect, test } from '../../src/fixtures'
import testData from '../../src/data/testData/web/TC13_web_recorridoDeGastoIndividualYPrivacidadEnLaDemo.json' with { type: 'json' }
import { defineCaseData } from '../../src/utils/caseData'

const data = defineCaseData(testData)
test.use({ caseData: data.setup })

test('TC13_web_recorridoDeGastoIndividualYPrivacidadEnLaDemo', async ({
  demoMember: _member,
  demoPanel,
  navigation,
  profilePage,
  expensesPage,
  balancePage,
}) => {
  const { private: individual, shared } = data.setup.demoExpenses

  await test.step('1. Rocío abre su perfil y comprueba que es Rocío', async () => {
    await profilePage.visit()
    await expect(profilePage.nameHeading(data.setup.demoUsers.rocio.name)).toBeVisible()
    await expect(profilePage.emailText(data.setup.demoUsers.rocio.email)).toBeVisible()
  })

  await test.step('2. Rocío crea un gasto individual de 35 € y lo conserva tras recargar', async () => {
    await expensesPage.visit()
    await expensesPage.addExpense(individual)
    await expect(expensesPage.row(individual.description)).toContainText(data.expected.toContainText)
    await expect(expensesPage.row(individual.description)).toContainText(data.expected.toContainText1)
    await expect(expensesPage.editLink(individual.description)).toBeVisible()
    await expensesPage.reload()
    await expect(expensesPage.row(individual.description)).toHaveCount(data.expected.toHaveCount)
    await expect(expensesPage.row(individual.description)).toContainText(data.expected.toContainText)
  })

  await test.step('3. Rocío comprueba que el gasto individual no altera el balance compartido', async () => {
    await navigation.open(data.inputs.section)
    await expect(balancePage.monthSummary).toContainText(data.expected.toContainText2)
    await expect(balancePage.monthBalance).toContainText(data.expected.toContainText3)
    await expect(balancePage.debtSummary).toContainText(data.expected.toContainText4)
  })

  await test.step('4. Rocío añade un gasto compartido y conserva las acciones de sus dos gastos', async () => {
    await expensesPage.visit()
    await expensesPage.addExpense(shared)
    await expect(expensesPage.row(shared.description)).toContainText(data.expected.toContainText5)
    await expect(expensesPage.editLink(shared.description)).toBeVisible()
    await expect(expensesPage.deleteButton(shared.description)).toBeVisible()
    await expect(expensesPage.editLink(individual.description)).toBeVisible()
  })

  await test.step('5. Pablo entra desde el panel mock y comprueba en su perfil que es Pablo', async () => {
    await demoPanel.selectUser(data.inputs.demoUser)
    await profilePage.visit()
    await expect(profilePage.nameHeading(data.setup.demoUsers.pablo.name)).toBeVisible()
    await expect(profilePage.emailText(data.setup.demoUsers.pablo.email)).toBeVisible()
  })

  await test.step('6. Pablo no ve el gasto individual de Rocío, ni filtrando por individuales', async () => {
    await expensesPage.visit()
    await expect(expensesPage.row(individual.description)).toHaveCount(data.expected.toHaveCount6)
    await expensesPage.filterByType(data.inputs.expenseType)
    await expect(expensesPage.row(individual.description)).toHaveCount(data.expected.toHaveCount6)
  })

  await test.step('7. Rocío vuelve a entrar y comprueba en su perfil que es Rocío', async () => {
    await demoPanel.selectUser(data.inputs.demoUserChoices.rocio.demoUser)
    await profilePage.visit()
    await expect(profilePage.nameHeading(data.setup.demoUsers.rocio.name)).toBeVisible()
    await expect(profilePage.emailText(data.setup.demoUsers.rocio.email)).toBeVisible()
  })

  await test.step('8. Rocío sigue viendo su gasto individual', async () => {
    await expensesPage.visit()
    await expect(expensesPage.row(individual.description)).toContainText(data.expected.toContainText)
  })
})
