import { expect, test } from '../../src/fixtures'
import { demoUsers } from '../../src/data/demoUsers'
import { demoExpenses } from '../../src/data/expenses'

test('TC13_web_recorridoDeGastoIndividualYPrivacidadEnLaDemo', async ({
  demoMember: _member,
  demoPanel,
  navigation,
  profilePage,
  expensesPage,
  balancePage,
}) => {
  const { private: individual, shared } = demoExpenses

  await test.step('1. Rocío abre su perfil y comprueba que es Rocío', async () => {
    await profilePage.visit()
    await expect(profilePage.nameHeading(demoUsers.rocio.name)).toBeVisible()
    await expect(profilePage.emailText(demoUsers.rocio.email)).toBeVisible()
  })

  await test.step('2. Rocío crea un gasto individual de 35 € y lo conserva tras recargar', async () => {
    await expensesPage.visit()
    await expensesPage.addExpense(individual)
    await expect(expensesPage.row(individual.description)).toContainText('35,00')
    await expect(expensesPage.row(individual.description)).toContainText('Individual')
    await expect(expensesPage.editLink(individual.description)).toBeVisible()
    await expensesPage.reload()
    await expect(expensesPage.row(individual.description)).toHaveCount(1)
    await expect(expensesPage.row(individual.description)).toContainText('35,00')
  })

  await test.step('3. Rocío comprueba que el gasto individual no altera el balance compartido', async () => {
    await navigation.open('Balance')
    await expect(balancePage.monthSummary).toContainText('705,80')
    await expect(balancePage.monthBalance).toContainText('227,10')
    await expect(balancePage.debtSummary).toContainText('354,20')
  })

  await test.step('4. Rocío añade un gasto compartido y conserva las acciones de sus dos gastos', async () => {
    await expensesPage.visit()
    await expensesPage.addExpense(shared)
    await expect(expensesPage.row(shared.description)).toContainText('80,00')
    await expect(expensesPage.editLink(shared.description)).toBeVisible()
    await expect(expensesPage.deleteButton(shared.description)).toBeVisible()
    await expect(expensesPage.editLink(individual.description)).toBeVisible()
  })

  await test.step('5. Pablo entra desde el panel mock y comprueba en su perfil que es Pablo', async () => {
    await demoPanel.selectUser('pablo')
    await profilePage.visit()
    await expect(profilePage.nameHeading(demoUsers.pablo.name)).toBeVisible()
    await expect(profilePage.emailText(demoUsers.pablo.email)).toBeVisible()
  })

  await test.step('6. Pablo no ve el gasto individual de Rocío, ni filtrando por individuales', async () => {
    await expensesPage.visit()
    await expect(expensesPage.row(individual.description)).toHaveCount(0)
    await expensesPage.filterByType('individual')
    await expect(expensesPage.row(individual.description)).toHaveCount(0)
  })

  await test.step('7. Rocío vuelve a entrar y comprueba en su perfil que es Rocío', async () => {
    await demoPanel.selectUser('rocio')
    await profilePage.visit()
    await expect(profilePage.nameHeading(demoUsers.rocio.name)).toBeVisible()
    await expect(profilePage.emailText(demoUsers.rocio.email)).toBeVisible()
  })

  await test.step('8. Rocío sigue viendo su gasto individual', async () => {
    await expensesPage.visit()
    await expect(expensesPage.row(individual.description)).toContainText('35,00')
  })
})
