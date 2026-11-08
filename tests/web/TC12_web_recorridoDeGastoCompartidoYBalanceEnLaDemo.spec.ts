import { expect, test } from '../../src/fixtures'
import { demoUsers } from '../../src/data/demoUsers'
import { demoExpenses } from '../../src/data/expenses'

test('TC12_web_recorridoDeGastoCompartidoYBalanceEnLaDemo', async ({
  demoMember: _member,
  navigation,
  profilePage,
  spacePage,
  expensesPage,
  balancePage,
}) => {
  const { shared } = demoExpenses

  await test.step('1. Rocío abre su perfil y comprueba que es Rocío', async () => {
    await profilePage.visit()
    await expect(profilePage.nameHeading(demoUsers.rocio.name)).toBeVisible()
    await expect(profilePage.emailText(demoUsers.rocio.email)).toBeVisible()
  })

  await test.step('2. Rocío entra en su espacio y ve que lo comparte con su pareja', async () => {
    await navigation.open('Espacio')
    await expect(spacePage.heading('Casa')).toBeVisible()
    await expect(spacePage.summary).toContainText('2 de 2')
  })

  await test.step('3. Rocío crea un gasto compartido de 80 €', async () => {
    await expensesPage.visit()
    await expensesPage.addExpense(shared)
    await expect(expensesPage.row(shared.description)).toHaveCount(1)
    await expect(expensesPage.row(shared.description)).toContainText('80,00')
    await expect(expensesPage.row(shared.description)).toContainText('Compartido')
    await expect(expensesPage.cell(shared.description, 'Tú')).toBeVisible()
  })

  await test.step('4. Rocío comprueba el reparto exacto en el balance y su persistencia tras recargar', async () => {
    await navigation.open('Balance')
    await expect(balancePage.monthSummary).toContainText('785,80')
    await expect(balancePage.ownContribution).toContainText('392,90')
    await expect(balancePage.monthBalance).toContainText('187,10')
    await expect(balancePage.debtSummary).toContainText('314,20')
    await balancePage.reload()
    await expect(balancePage.debtSummary).toContainText('314,20')
  })

  await test.step('5. Rocío edita el importe del gasto a 100 € sin duplicarlo', async () => {
    await expensesPage.visit()
    await expensesPage.editAmount(shared.description, '100,00')
    await expensesPage.reload()
    await expect(expensesPage.row(shared.description)).toHaveCount(1)
    await expect(expensesPage.row(shared.description)).toContainText('100,00')
  })

  await test.step('6. Rocío comprueba que el balance se recalcula con el importe editado', async () => {
    await navigation.open('Balance')
    await expect(balancePage.monthSummary).toContainText('805,80')
    await expect(balancePage.debtSummary).toContainText('304,20')
  })
})
