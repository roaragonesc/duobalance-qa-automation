import { expect, test } from '../../src/fixtures'

test('TC51_web_crearGastoCompartidoEnElEspacioDemo', async ({ demoPanel, navigation, spacePage, expensesPage }) => {
  await demoPanel.selectUser('rocio')
  await navigation.open('Espacio')
  await expect(spacePage.heading('Casa')).toBeVisible()
  await expect(spacePage.summary).toContainText('2 de 2')
  await expensesPage.visit()
  await expensesPage.addExpense({ description: 'Compra compartida Pages', amount: '80,00' })
  await expect(expensesPage.row('Compra compartida Pages')).toContainText('80,00')
  await expect(expensesPage.row('Compra compartida Pages')).toContainText('Compartido')
})
