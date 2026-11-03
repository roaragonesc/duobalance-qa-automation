import { expect, test } from '../fixtures'

test('TC26_excluirElGastoPrivadoDelBalanceYDeLaOtraIdentidadDemo', async ({
  page, demoPanel, expensesPage,
}) => {
  await test.step('TC101_conservarGastoIndividualEnElNavegador', async () => {
    await demoPanel.selectUser('rocio')
    await expensesPage.visit()
    await expensesPage.addExpense({ description: 'Gasto privado Pages', amount: '35,00', individual: true })
    await expect(expensesPage.row('Gasto privado Pages')).toContainText('35,00')
    await expect(expensesPage.row('Gasto privado Pages')).toContainText('Individual')
    await page.reload()
    await expect(expensesPage.row('Gasto privado Pages')).toHaveCount(1)
    await expect(expensesPage.row('Gasto privado Pages')).toContainText('35,00')
  })

  await test.step('TC102_excluirGastoIndividualDelBalanceCompartido', async () => {
    await page.getByRole('link', { name: 'Balance', exact: true }).click()
    await expect(page.getByRole('region', { name: /Resumen de/ })).toContainText('705,80')
    await expect(page.getByRole('region', { name: 'Saldo del mes', exact: true })).toContainText('227,10')
    await expect(page.getByRole('region', { name: '¿Quién debe a quién?' })).toContainText('354,20')
  })

  await test.step('TC103_cambiarIdentidadDentroDelMismoAlmacenDemo', async () => {
    await demoPanel.selectUser('pablo')
    await expensesPage.visit()
    await expect(expensesPage.row('Gasto privado Pages')).toHaveCount(0)
    await page.getByLabel('Tipo', { exact: true }).selectOption('individual')
    await expect(expensesPage.row('Gasto privado Pages')).toHaveCount(0)
    await demoPanel.selectUser('rocio')
    await expensesPage.visit()
    await expect(expensesPage.row('Gasto privado Pages')).toContainText('35,00')
  })
})
