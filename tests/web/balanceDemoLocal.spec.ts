import { expect, test } from '../fixtures'

test('TC25_conservarGastosCompartidosYBalanceEnElNavegador', async ({
  page, demoPanel, expensesPage,
}) => {
  await test.step('TC98_crearGastoCompartidoEnElEspacioDemo', async () => {
    await demoPanel.selectUser('rocio')
    await page.getByRole('link', { name: 'Espacio', exact: true }).click()
    await expect(page.getByRole('heading', { name: 'Casa', exact: true })).toBeVisible()
    await expect(page.getByRole('region', { name: 'Resumen del espacio' })).toContainText('2 de 2')
    await expensesPage.visit()
    await expensesPage.addExpense({ description: 'Compra compartida Pages', amount: '80,00' })
    await expect(expensesPage.row('Compra compartida Pages')).toContainText('80,00')
    await expect(expensesPage.row('Compra compartida Pages')).toContainText('Compartido')
  })

  await test.step('TC99_comprobarRepartoYPersistenciaLocal', async () => {
    await page.getByRole('link', { name: 'Balance', exact: true }).click()
    await expect(page.getByRole('region', { name: /Resumen de/ })).toContainText('785,80')
    await expect(page.getByRole('region', { name: 'Tu aportación', exact: true })).toContainText('392,90')
    await expect(page.getByRole('region', { name: 'Saldo del mes', exact: true })).toContainText('187,10')
    await expect(page.getByRole('region', { name: '¿Quién debe a quién?' })).toContainText('314,20')
    await page.reload()
    await expect(page.getByRole('region', { name: '¿Quién debe a quién?' })).toContainText('314,20')
  })

  await test.step('TC100_editarGastoPropioYRecalcularSinDuplicados', async () => {
    await expensesPage.visit()
    await expensesPage.editAmount('Compra compartida Pages', '100,00')
    await page.reload()
    await expect(expensesPage.row('Compra compartida Pages')).toHaveCount(1)
    await expect(expensesPage.row('Compra compartida Pages')).toContainText('100,00')
    await page.getByRole('link', { name: 'Balance', exact: true }).click()
    await expect(page.getByRole('region', { name: /Resumen de/ })).toContainText('805,80')
    await expect(page.getByRole('region', { name: '¿Quién debe a quién?' })).toContainText('304,20')
  })
})
