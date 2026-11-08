import { expect, test } from '../../src/fixtures'
import { demoUsers } from '../../src/data/demoUsers'
import { demoExpenses, foodCategoryName } from '../../src/data/expenses'

test('TC67_web_recorridoDeGastosCompartidosEIndividualesEntreRocioYPablo', async ({
  demoMember: _member,
  demoPanel,
  expensesPage,
}) => {
  const { shared, private: rocioPrivate, partnerShared, partnerPrivate } = demoExpenses
  const rocio = demoUsers.rocio.name
  const pablo = demoUsers.pablo.name

  await test.step('Gastos - Rocío crea un gasto compartido', async () => {
    await expensesPage.visit()
    await expensesPage.addExpense(shared)
    const row = expensesPage.row(shared.description)
    await expect(row).toHaveCount(1)
    await expect(expensesPage.cell(shared.description, foodCategoryName)).toBeVisible()
    await expect(row).toContainText('Compartido')
    await expect(expensesPage.cell(shared.description, 'Tú')).toBeVisible()
    await expect(row).toContainText(shared.amount)
  })

  await test.step('Gastos - Pablo ve el gasto compartido de Rocío con los mismos datos', async () => {
    await demoPanel.selectUser('pablo')
    await expensesPage.visit()
    const row = expensesPage.row(shared.description)
    await expect(row).toHaveCount(1)
    await expect(expensesPage.cell(shared.description, foodCategoryName)).toBeVisible()
    await expect(row).toContainText('Compartido')
    await expect(expensesPage.cell(shared.description, rocio)).toBeVisible()
    await expect(row).toContainText(shared.amount)
  })

  await test.step('Gastos - Pablo añade su propio gasto compartido', async () => {
    await expensesPage.addExpense(partnerShared)
    const row = expensesPage.row(partnerShared.description)
    await expect(row).toHaveCount(1)
    await expect(expensesPage.cell(partnerShared.description, foodCategoryName)).toBeVisible()
    await expect(row).toContainText('Compartido')
    await expect(expensesPage.cell(partnerShared.description, 'Tú')).toBeVisible()
    await expect(row).toContainText(partnerShared.amount)
  })

  await test.step('Gastos - Rocío ve el gasto de Pablo con los mismos datos y conserva el suyo sin duplicados', async () => {
    await demoPanel.selectUser('rocio')
    await expensesPage.visit()
    const pabloRow = expensesPage.row(partnerShared.description)
    await expect(pabloRow).toHaveCount(1)
    await expect(expensesPage.cell(partnerShared.description, foodCategoryName)).toBeVisible()
    await expect(pabloRow).toContainText('Compartido')
    await expect(expensesPage.cell(partnerShared.description, pablo)).toBeVisible()
    await expect(pabloRow).toContainText(partnerShared.amount)

    const ownRow = expensesPage.row(shared.description)
    await expect(ownRow).toHaveCount(1)
    await expect(expensesPage.cell(shared.description, 'Tú')).toBeVisible()
    await expect(ownRow).toContainText(shared.amount)
  })

  await test.step('Gastos - Rocío crea un gasto individual', async () => {
    await expensesPage.addExpense(rocioPrivate)
    const row = expensesPage.row(rocioPrivate.description)
    await expect(row).toHaveCount(1)
    await expect(expensesPage.cell(rocioPrivate.description, foodCategoryName)).toBeVisible()
    await expect(row).toContainText('Individual')
    await expect(expensesPage.cell(rocioPrivate.description, 'Tú')).toBeVisible()
    await expect(row).toContainText(rocioPrivate.amount)
  })

  await test.step('Gastos - Pablo no ve el gasto individual de Rocío, ni filtrando por individuales', async () => {
    await demoPanel.selectUser('pablo')
    await expensesPage.visit()
    await expect(expensesPage.row(rocioPrivate.description)).toHaveCount(0)
    await expensesPage.filterByType('individual')
    await expect(expensesPage.row(rocioPrivate.description)).toHaveCount(0)
  })

  await test.step('Gastos - Pablo crea un gasto individual propio', async () => {
    await expensesPage.filterByType('all')
    await expensesPage.addExpense(partnerPrivate)
    const row = expensesPage.row(partnerPrivate.description)
    await expect(row).toHaveCount(1)
    await expect(expensesPage.cell(partnerPrivate.description, foodCategoryName)).toBeVisible()
    await expect(row).toContainText('Individual')
    await expect(expensesPage.cell(partnerPrivate.description, 'Tú')).toBeVisible()
    await expect(row).toContainText(partnerPrivate.amount)
  })

  await test.step('Gastos - Rocío no ve el gasto individual de Pablo y conserva el suyo con sus datos', async () => {
    await demoPanel.selectUser('rocio')
    await expensesPage.visit()
    await expect(expensesPage.row(partnerPrivate.description)).toHaveCount(0)

    const ownRow = expensesPage.row(rocioPrivate.description)
    await expect(ownRow).toHaveCount(1)
    await expect(expensesPage.cell(rocioPrivate.description, foodCategoryName)).toBeVisible()
    await expect(ownRow).toContainText('Individual')
    await expect(expensesPage.cell(rocioPrivate.description, 'Tú')).toBeVisible()
    await expect(ownRow).toContainText(rocioPrivate.amount)

    await expensesPage.filterByType('individual')
    await expect(expensesPage.row(partnerPrivate.description)).toHaveCount(0)
    await expect(ownRow).toHaveCount(1)
  })
})
