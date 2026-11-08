import { expect, test } from '../../src/fixtures'
import testData from '../../src/data/testData/web/TC15_web_recorridoDeGastosCompartidosEIndividualesEntreRocioYPablo.json'
import { defineCaseData } from '../../src/utils/caseData'

const data = defineCaseData(testData)
test.use({ caseData: data.setup })

test('TC15_web_recorridoDeGastosCompartidosEIndividualesEntreRocioYPablo', async ({
  demoMember: _member,
  demoPanel,
  profilePage,
  expensesPage,
}) => {
  const { shared, private: rocioPrivate, partnerShared, partnerPrivate } = data.setup.demoExpenses
  const rocio = data.setup.demoUsers.rocio
  const pablo = data.setup.demoUsers.pablo

  await test.step('1. Rocío abre su perfil y comprueba que es Rocío', async () => {
    await profilePage.visit()
    await expect(profilePage.nameHeading(rocio.name)).toBeVisible()
    await expect(profilePage.emailText(rocio.email)).toBeVisible()
  })

  await test.step('2. Rocío crea un gasto compartido', async () => {
    await expensesPage.visit()
    await expensesPage.addExpense(shared)
    await expect(expensesPage.row(shared.description)).toHaveCount(data.expected.toHaveCount)
    await expect(expensesPage.cell(shared.description, data.expected.foodCategoryName)).toBeVisible()
    await expect(expensesPage.row(shared.description)).toContainText(data.expected.toContainText)
    await expect(expensesPage.cell(shared.description, data.expected.cell)).toBeVisible()
    await expect(expensesPage.row(shared.description)).toContainText(shared.amount)
  })

  await test.step('3. Pablo entra desde el panel mock y comprueba en su perfil que es Pablo', async () => {
    await demoPanel.selectUser(data.inputs.demoUser)
    await profilePage.visit()
    await expect(profilePage.nameHeading(pablo.name)).toBeVisible()
    await expect(profilePage.emailText(pablo.email)).toBeVisible()
  })

  await test.step('4. Pablo ve el gasto compartido de Rocío con los mismos datos', async () => {
    await expensesPage.visit()
    await expect(expensesPage.row(shared.description)).toHaveCount(data.expected.toHaveCount)
    await expect(expensesPage.cell(shared.description, data.expected.foodCategoryName)).toBeVisible()
    await expect(expensesPage.row(shared.description)).toContainText(data.expected.toContainText)
    await expect(expensesPage.cell(shared.description, rocio.name)).toBeVisible()
    await expect(expensesPage.row(shared.description)).toContainText(shared.amount)
  })

  await test.step('5. Pablo añade su propio gasto compartido', async () => {
    await expensesPage.addExpense(partnerShared)
    await expect(expensesPage.row(partnerShared.description)).toHaveCount(data.expected.toHaveCount)
    await expect(expensesPage.cell(partnerShared.description, data.expected.foodCategoryName)).toBeVisible()
    await expect(expensesPage.row(partnerShared.description)).toContainText(data.expected.toContainText)
    await expect(expensesPage.cell(partnerShared.description, data.expected.cell)).toBeVisible()
    await expect(expensesPage.row(partnerShared.description)).toContainText(partnerShared.amount)
  })

  await test.step('6. Rocío entra desde el panel mock y comprueba en su perfil que es Rocío', async () => {
    await demoPanel.selectUser(data.inputs.demoUserChoices.rocio.demoUser)
    await profilePage.visit()
    await expect(profilePage.nameHeading(rocio.name)).toBeVisible()
    await expect(profilePage.emailText(rocio.email)).toBeVisible()
  })

  await test.step('7. Rocío ve el gasto de Pablo con los mismos datos y conserva el suyo sin duplicados', async () => {
    await expensesPage.visit()
    await expect(expensesPage.row(partnerShared.description)).toHaveCount(data.expected.toHaveCount)
    await expect(expensesPage.cell(partnerShared.description, data.expected.foodCategoryName)).toBeVisible()
    await expect(expensesPage.row(partnerShared.description)).toContainText(data.expected.toContainText)
    await expect(expensesPage.cell(partnerShared.description, pablo.name)).toBeVisible()
    await expect(expensesPage.row(partnerShared.description)).toContainText(partnerShared.amount)
    await expect(expensesPage.row(shared.description)).toHaveCount(data.expected.toHaveCount)
    await expect(expensesPage.cell(shared.description, data.expected.cell)).toBeVisible()
    await expect(expensesPage.row(shared.description)).toContainText(shared.amount)
  })

  await test.step('8. Rocío crea un gasto individual', async () => {
    await expensesPage.addExpense(rocioPrivate)
    await expect(expensesPage.row(rocioPrivate.description)).toHaveCount(data.expected.toHaveCount)
    await expect(expensesPage.cell(rocioPrivate.description, data.expected.foodCategoryName)).toBeVisible()
    await expect(expensesPage.row(rocioPrivate.description)).toContainText(data.expected.toContainText1)
    await expect(expensesPage.cell(rocioPrivate.description, data.expected.cell)).toBeVisible()
    await expect(expensesPage.row(rocioPrivate.description)).toContainText(rocioPrivate.amount)
  })

  await test.step('9. Pablo entra desde el panel mock y comprueba en su perfil que es Pablo', async () => {
    await demoPanel.selectUser(data.inputs.demoUser)
    await profilePage.visit()
    await expect(profilePage.nameHeading(pablo.name)).toBeVisible()
    await expect(profilePage.emailText(pablo.email)).toBeVisible()
  })

  await test.step('10. Pablo no ve el gasto individual de Rocío, ni filtrando por individuales', async () => {
    await expensesPage.visit()
    await expect(expensesPage.row(rocioPrivate.description)).toHaveCount(data.expected.toHaveCount2)
    await expensesPage.filterByType(data.inputs.expenseType)
    await expect(expensesPage.row(rocioPrivate.description)).toHaveCount(data.expected.toHaveCount2)
  })

  await test.step('11. Pablo crea un gasto individual propio', async () => {
    await expensesPage.filterByType(data.inputs.expenseTypeChoices.all.expenseType)
    await expensesPage.addExpense(partnerPrivate)
    await expect(expensesPage.row(partnerPrivate.description)).toHaveCount(data.expected.toHaveCount)
    await expect(expensesPage.cell(partnerPrivate.description, data.expected.foodCategoryName)).toBeVisible()
    await expect(expensesPage.row(partnerPrivate.description)).toContainText(data.expected.toContainText1)
    await expect(expensesPage.cell(partnerPrivate.description, data.expected.cell)).toBeVisible()
    await expect(expensesPage.row(partnerPrivate.description)).toContainText(partnerPrivate.amount)
  })

  await test.step('12. Rocío entra desde el panel mock y comprueba en su perfil que es Rocío', async () => {
    await demoPanel.selectUser(data.inputs.demoUserChoices.rocio.demoUser)
    await profilePage.visit()
    await expect(profilePage.nameHeading(rocio.name)).toBeVisible()
    await expect(profilePage.emailText(rocio.email)).toBeVisible()
  })

  await test.step('13. Rocío no ve el gasto individual de Pablo y conserva el suyo con sus datos', async () => {
    await expensesPage.visit()
    await expect(expensesPage.row(partnerPrivate.description)).toHaveCount(data.expected.toHaveCount2)
    await expect(expensesPage.row(rocioPrivate.description)).toHaveCount(data.expected.toHaveCount)
    await expect(expensesPage.cell(rocioPrivate.description, data.expected.foodCategoryName)).toBeVisible()
    await expect(expensesPage.row(rocioPrivate.description)).toContainText(data.expected.toContainText1)
    await expect(expensesPage.cell(rocioPrivate.description, data.expected.cell)).toBeVisible()
    await expect(expensesPage.row(rocioPrivate.description)).toContainText(rocioPrivate.amount)
    await expensesPage.filterByType(data.inputs.expenseType)
    await expect(expensesPage.row(partnerPrivate.description)).toHaveCount(data.expected.toHaveCount2)
    await expect(expensesPage.row(rocioPrivate.description)).toHaveCount(data.expected.toHaveCount)
  })
})
