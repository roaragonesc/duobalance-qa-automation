import { expect, test } from '../../src/fixtures'

import { BalancePage } from '../../src/pages/BalancePage'
import { ProfilePage } from '../../src/pages/ProfilePage'
import testData from '../../src/data/testData/web/TC23_web_elGastoNoGeneraBalanceParaNinguno.json' with { type: 'json' }
import { defineCaseData } from '../../src/utils/caseData'

const data = defineCaseData(testData)
test.use({ caseData: data.setup })

// Requiere API real: necesita dos sesiones con datos compartidos y no se puede probar en modo mock.
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC23_web_elGastoNoGeneraBalanceParaNinguno', async ({ privateExpense: _expense, page, partnerPage }) => {
  const anaProfile = new ProfilePage(page)
  const anaBalance = new BalancePage(page)
  const luisProfile = new ProfilePage(partnerPage)
  const luisBalance = new BalancePage(partnerPage)

  await test.step('1. Ana abre su perfil y comprueba que es Ana', async () => {
    await anaProfile.visit()
    await expect(anaProfile.nameHeading(data.setup.journeyUsers.a.name)).toBeVisible()
    await expect(anaProfile.emailText(data.setup.journeyUsers.a.email)).toBeVisible()
  })

  await test.step('2. Ana abre el balance y no ve deuda por el gasto privado', async () => {
    await anaBalance.visit()
    await expect(anaBalance.noBalanceHeading).toBeVisible()
    await expect(anaBalance.main).not.toContainText(data.expected.toContainText)
  })

  await test.step('3. Luis abre su perfil y comprueba que es Luis', async () => {
    await luisProfile.visit()
    await expect(luisProfile.nameHeading(data.setup.journeyUsers.b.name)).toBeVisible()
    await expect(luisProfile.emailText(data.setup.journeyUsers.b.email)).toBeVisible()
  })

  await test.step('4. Luis abre el balance y no ve deuda por el gasto privado', async () => {
    await luisBalance.visit()
    await expect(luisBalance.noBalanceHeading).toBeVisible()
    await expect(luisBalance.main).not.toContainText(data.expected.toContainText)
  })
})
