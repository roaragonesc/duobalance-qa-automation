import { expect, test } from '../../src/fixtures'

import { ExpensesPage } from '../../src/pages/ExpensesPage'
import { ProfilePage } from '../../src/pages/ProfilePage'
import testData from '../../src/data/testData/web/TC25_web_conservarElGastoPropioSinRevelarloMedianteFiltrosALaOtraCuenta.json' with { type: 'json' }
import { defineCaseData } from '../../src/utils/caseData'

const data = defineCaseData(testData)
test.use({ caseData: data.setup })

// Requiere API real: necesita dos sesiones con datos compartidos y no se puede probar en modo mock.
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC25_web_conservarElGastoPropioSinRevelarloMedianteFiltrosALaOtraCuenta', async ({
  privateExpense: _expense,
  page,
  partnerPage,
  expensesPage: anaExpenses,
}) => {
  const anaProfile = new ProfilePage(page)
  const luisProfile = new ProfilePage(partnerPage)
  const luisExpenses = new ExpensesPage(partnerPage)

  await test.step('1. Ana abre su perfil y comprueba que es Ana', async () => {
    await anaProfile.visit()
    await expect(anaProfile.nameHeading(data.setup.journeyUsers.a.name)).toBeVisible()
    await expect(anaProfile.emailText(data.setup.journeyUsers.a.email)).toBeVisible()
  })

  await test.step('2. Ana abre su lista de gastos y ve su gasto privado', async () => {
    await anaExpenses.visit()
    await expect(anaExpenses.row(data.expected.row)).toBeVisible()
  })

  await test.step('3. Ana recarga y su gasto privado persiste una sola vez', async () => {
    await anaExpenses.reload()
    await expect(anaExpenses.row(data.expected.row)).toHaveCount(data.expected.toHaveCount)
    await expect(anaExpenses.row(data.expected.row)).toContainText(data.expected.toContainText)
  })

  await test.step('4. Ana crea un gasto compartido de control de 2 €', async () => {
    // A shared control expense makes the filter controls available in Luis's list.
    await anaExpenses.addExpense({
      description: data.inputs.description,
      amount: data.inputs.amount,
      category: data.inputs.category,
      individual: data.inputs.individual,
    })
  })

  await test.step('5. Luis abre su perfil y comprueba que es Luis', async () => {
    await luisProfile.visit()
    await expect(luisProfile.nameHeading(data.setup.journeyUsers.b.name)).toBeVisible()
    await expect(luisProfile.emailText(data.setup.journeyUsers.b.email)).toBeVisible()
  })

  await test.step('6. Luis abre la lista de gastos y ve el gasto de control', async () => {
    await luisExpenses.visit()
    await expect(luisExpenses.row(data.expected.row1)).toBeVisible()
  })

  await test.step('7. Luis filtra por gastos individuales y no ve el gasto privado de Ana', async () => {
    await luisExpenses.filterByType(data.inputs.expenseType)
    await expect(luisExpenses.row(data.expected.row)).toHaveCount(data.expected.toHaveCount2)
    await expect(luisExpenses.individualTotal).toContainText(data.expected.toContainText3)
  })

  await test.step('8. Luis filtra por gastos compartidos de alimentación y no ve el gasto privado de Ana', async () => {
    await luisExpenses.filterByType(data.inputs.expenseTypeChoices.shared.expenseType)
    await luisExpenses.filterByCategory(data.inputs.filterByCategory)
    await expect(luisExpenses.row(data.expected.row1)).toBeVisible()
    await expect(luisExpenses.row(data.expected.row)).toHaveCount(data.expected.toHaveCount2)
  })
})
