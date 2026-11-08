import { expect, test } from '../../src/fixtures/pagesDemo'
import { DemoPanel } from '../../src/components/DemoPanel'
import { AppNavigation } from '../../src/components/AppNavigation'
import { frontendURL } from '../../src/config/environment'
import { ExpensesPage } from '../../src/pages/ExpensesPage'
import { LoginPage } from '../../src/pages/LoginPage'
import testData from '../../src/data/testData/web/TC03_web_usarLaDemoEstaticaDesdeMovilSinBackend.json'
import { defineCaseData } from '../../src/utils/caseData'

const data = defineCaseData(testData)
test.use({ caseData: data.setup })

test.use({
  viewport: { width: data.inputs.width, height: data.inputs.height },
  isMobile: data.inputs.isMobile,
  hasTouch: data.inputs.hasTouch,
})

test('TC03_web_usarLaDemoEstaticaDesdeMovilSinBackend', async ({ page }) => {
  const demoPanel = new DemoPanel(page)
  const navigation = new AppNavigation(page)
  const expenses = new ExpensesPage(page)

  await test.step('1. El usuario abre la demo desde el móvil y llega al login', async () => {
    await new LoginPage(page).visitRoot()
    await expect(page).toHaveURL(new URL('./#/login', frontendURL).href)
  })

  await test.step('2. El usuario entra como Rocío desde el panel mock y llega al dashboard', async () => {
    await demoPanel.selectUser(data.inputs.demoUser)
    await expect(page).toHaveURL(new URL('./#/dashboard', frontendURL).href)
  })

  await test.step('3. El usuario oculta el panel y salta al contenido con el teclado', async () => {
    await demoPanel.hideButton.click()
    await navigation.skipLink.focus()
    await navigation.skipLink.press('Enter')
    await expect(expenses.main).toBeFocused()
    await expect(page).toHaveURL(new URL('./#/dashboard', frontendURL).href)
  })

  await test.step('4. El usuario añade un gasto de 12,50 € desde Gastos y lo conserva tras recargar', async () => {
    await navigation.open(data.inputs.section)
    await expenses.addExpense({
      description: data.inputs.description,
      amount: data.inputs.amount,
      category: data.inputs.category,
      individual: data.inputs.individual,
    })
    await expect(expenses.row(data.expected.row)).toContainText(data.expected.toContainText)
    await expenses.reload()
    await expect(page).toHaveURL(new URL('./#/expenses', frontendURL).href)
    await expect(expenses.row(data.expected.row)).toContainText(data.expected.toContainText)
  })

  await test.step('5. El usuario restablece los datos de prueba y vuelve al login', async () => {
    await demoPanel.resetMockData()
    await expect(page).toHaveURL(new URL('./#/login', frontendURL).href)
    await expect(demoPanel.userSelect).toHaveValue(data.expected.toHaveValue)
  })
})
