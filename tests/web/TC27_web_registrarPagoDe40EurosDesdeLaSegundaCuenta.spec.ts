import { expect, test } from '../../src/fixtures'

import { ExpensesPage } from '../../src/pages/ExpensesPage'
import { ProfilePage } from '../../src/pages/ProfilePage'
import testData from '../../src/data/testData/web/TC27_web_registrarPagoDe40EurosDesdeLaSegundaCuenta.json' with { type: 'json' }
import { defineCaseData } from '../../src/utils/caseData'

const data = defineCaseData(testData)
test.use({ caseData: data.setup })

// Requiere API real: necesita dos sesiones con datos compartidos y no se puede probar en modo mock.
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC27_web_registrarPagoDe40EurosDesdeLaSegundaCuenta', async ({ couple: _couple, partnerPage }) => {
  const luisProfile = new ProfilePage(partnerPage)
  const luisExpenses = new ExpensesPage(partnerPage)

  await test.step('1. Luis abre su perfil y comprueba que es Luis', async () => {
    await luisProfile.visit()
    await expect(luisProfile.nameHeading(data.setup.journeyUsers.b.name)).toBeVisible()
    await expect(luisProfile.emailText(data.setup.journeyUsers.b.email)).toBeVisible()
  })

  await test.step('2. Luis abre la lista de gastos', async () => {
    await luisExpenses.visit()
  })

  await test.step('3. Luis crea un gasto compartido de 40 € y lo ve en la lista', async () => {
    await luisExpenses.addExpense({
      description: data.inputs.description,
      amount: data.inputs.amount,
      category: data.inputs.category,
      individual: data.inputs.individual,
    })
    await expect(luisExpenses.row(data.expected.row)).toContainText(data.expected.toContainText)
  })
})
