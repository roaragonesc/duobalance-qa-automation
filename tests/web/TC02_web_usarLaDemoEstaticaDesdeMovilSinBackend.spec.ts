import { expect, test } from '../../src/fixtures/pagesDemo'
import { DemoPanel } from '../../src/components/DemoPanel'
import { AppNavigation } from '../../src/components/AppNavigation'
import { frontendURL } from '../../src/config/environment'
import { ExpensesPage } from '../../src/pages/ExpensesPage'
import { LoginPage } from '../../src/pages/LoginPage'

test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })

test('TC02_web_usarLaDemoEstaticaDesdeMovilSinBackend', async ({ page }) => {
  const demoPanel = new DemoPanel(page)
  const navigation = new AppNavigation(page)
  const expenses = new ExpensesPage(page)
  await new LoginPage(page).visitRoot()
  await expect(page).toHaveURL(new URL('./#/login', frontendURL).href)
  await demoPanel.selectUser('rocio')
  await expect(page).toHaveURL(new URL('./#/dashboard', frontendURL).href)
  await demoPanel.hideButton.click()
  await navigation.skipLink.focus()
  await navigation.skipLink.press('Enter')
  await expect(expenses.main).toBeFocused()
  await expect(page).toHaveURL(new URL('./#/dashboard', frontendURL).href)
  await navigation.open('Gastos')
  await expenses.addExpense({ description: 'Compra demo Pages', amount: '12,50' })
  await expect(expenses.row('Compra demo Pages')).toContainText('12,50')
  await expenses.reload()
  await expect(page).toHaveURL(new URL('./#/expenses', frontendURL).href)
  await expect(expenses.row('Compra demo Pages')).toContainText('12,50')
  await demoPanel.resetMockData()
  await expect(page).toHaveURL(new URL('./#/login', frontendURL).href)
  await expect(demoPanel.userSelect).toHaveValue('')
})
