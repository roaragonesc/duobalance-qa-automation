import { expect, test } from '../../src/fixtures'

import { ExpensesPage } from '../../src/pages/ExpensesPage'
import { ProfilePage } from '../../src/pages/ProfilePage'
import testData from '../../src/data/testData/web/TC36_web_consultarSoloElGastoComunYCrearOtroDesdeLaSegundaCuenta.json' with { type: 'json' }
import { defineCaseData } from '../../src/utils/caseData'

const data = defineCaseData(testData)
test.use({ caseData: data.setup })

// Requiere API real: necesita dos sesiones con datos compartidos y no se puede probar en modo mock.
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC36_web_consultarSoloElGastoComunYCrearOtroDesdeLaSegundaCuenta', async ({
  sharedAndPrivateExpenses: _expenses,
  partnerPage,
}) => {
  const luisProfile = new ProfilePage(partnerPage)
  const luisExpenses = new ExpensesPage(partnerPage)

  await test.step('1. Luis abre su perfil y comprueba que es Luis', async () => {
    await luisProfile.visit()
    await expect(luisProfile.nameHeading(data.setup.journeyUsers.b.name)).toBeVisible()
    await expect(luisProfile.emailText(data.setup.journeyUsers.b.email)).toBeVisible()
  })

  await test.step('2. Luis abre la lista de gastos y solo ve el gasto común', async () => {
    await luisExpenses.visit()
    await expect(luisExpenses.row(data.expected.row)).toContainText(data.expected.toContainText)
    await expect(luisExpenses.row(data.expected.row1)).toHaveCount(data.expected.toHaveCount)
  })

  await test.step('3. Luis filtra por gastos individuales y no ve el gasto privado de Ana', async () => {
    await luisExpenses.filterByType(data.inputs.expenseType)
    await expect(luisExpenses.row(data.expected.row1)).toHaveCount(data.expected.toHaveCount)
  })

  await test.step('4. Luis crea un gasto compartido de 40 € y lo ve en la lista', async () => {
    await luisExpenses.filterByType(data.inputs.expenseTypeChoices.all.expenseType)
    await luisExpenses.addExpense({
      description: data.inputs.description,
      amount: data.inputs.amount,
      category: data.inputs.category,
      individual: data.inputs.individual,
    })
    await expect(luisExpenses.row(data.expected.row2)).toContainText(data.expected.toContainText3)
  })
})
