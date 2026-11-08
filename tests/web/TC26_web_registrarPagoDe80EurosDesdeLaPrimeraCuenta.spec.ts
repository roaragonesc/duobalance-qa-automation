import { expect, test } from '../../src/fixtures'

import { ProfilePage } from '../../src/pages/ProfilePage'
import testData from '../../src/data/testData/web/TC26_web_registrarPagoDe80EurosDesdeLaPrimeraCuenta.json' with { type: 'json' }
import { defineCaseData } from '../../src/utils/caseData'

const data = defineCaseData(testData)
test.use({ caseData: data.setup })

// Requiere API real: necesita dos sesiones con datos compartidos y no se puede probar en modo mock.
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC26_web_registrarPagoDe80EurosDesdeLaPrimeraCuenta', async ({
  couple: _couple,
  page,
  expensesPage: anaExpenses,
  balancePage: anaBalance,
}) => {
  const anaProfile = new ProfilePage(page)

  await test.step('1. Ana abre su perfil y comprueba que es Ana', async () => {
    await anaProfile.visit()
    await expect(anaProfile.nameHeading(data.setup.journeyUsers.a.name)).toBeVisible()
    await expect(anaProfile.emailText(data.setup.journeyUsers.a.email)).toBeVisible()
  })

  await test.step('2. Ana crea un gasto compartido de 80 €', async () => {
    await anaExpenses.addExpense({
      description: data.inputs.description,
      amount: data.inputs.amount,
      category: data.inputs.category,
      individual: data.inputs.individual,
    })
  })

  await test.step('3. Ana abre el balance y ve que Luis le debe 40 €', async () => {
    await anaBalance.visit()
    await expect(anaBalance.debtSummary).toContainText(data.expected.toContainText)
    await expect(anaBalance.debtSummary).toContainText(data.expected.toContainText1)
  })
})
