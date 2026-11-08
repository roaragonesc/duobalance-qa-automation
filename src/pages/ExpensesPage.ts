import type { Locator, Page } from '@playwright/test'
import { applicationPath } from '../utils/application'
import { BasePage } from './BasePage'

type ExpenseInput = {
  description: string
  amount: string
  individual?: boolean
}

export type ExpenseTypeFilter = 'all' | 'shared' | 'individual'

export class ExpensesPage extends BasePage {
  protected readonly path = '/expenses'

  readonly permissionDeniedMessage = 'No se ha encontrado el gasto o no tienes permiso para modificarlo.'
  readonly heading: Locator
  readonly noExpensesHeading: Locator
  readonly typeFilter: Locator
  readonly categoryFilter: Locator
  readonly sharedTotal: Locator
  readonly individualTotal: Locator
  readonly addLink: Locator
  readonly conceptField: Locator
  readonly amountField: Locator
  readonly categoryField: Locator
  readonly individualOption: Locator
  readonly submitButton: Locator
  readonly saveButton: Locator

  constructor(page: Page) {
    super(page)
    this.heading = page.getByRole('heading', { name: 'Gastos', exact: true })
    this.noExpensesHeading = page.getByRole('heading', { name: /Todavía no hay gastos en/ })
    this.typeFilter = page.getByLabel('Tipo', { exact: true })
    this.categoryFilter = page.getByLabel('Categoría', { exact: true })
    this.sharedTotal = page.getByRole('region', { name: 'Compartidos', exact: true })
    this.individualTotal = page.getByRole('region', { name: 'Individuales', exact: true })
    this.addLink = page.getByRole('link', { name: 'Añadir gasto' })
    this.conceptField = page.getByLabel('Concepto')
    this.amountField = page.getByLabel('Importe (€)')
    this.categoryField = page.getByLabel('Categoría')
    this.individualOption = page.getByRole('radio', { name: /Individual/ })
    this.submitButton = page.getByRole('button', { name: 'Añadir gasto' })
    this.saveButton = page.getByRole('button', { name: 'Guardar cambios' })
  }

  async addExpense({ description, amount, individual = false }: ExpenseInput) {
    await this.addLink.click()
    await this.conceptField.fill(description)
    await this.amountField.fill(amount)
    await this.categoryField.selectOption('food')
    if (individual) {
      await this.individualOption.check()
    }
    await this.submitButton.click()
    await this.page.waitForURL((url) => applicationPath(url) === this.path)
  }

  row(description: string) {
    return this.page.getByRole('row').filter({
      has: this.page.getByRole('rowheader', { name: description, exact: true }),
    })
  }

  cell(description: string, name: string) {
    return this.row(description).getByRole('cell', { name, exact: true })
  }

  editLink(description: string) {
    return this.row(description).getByRole('link', { name: `Editar ${description}` })
  }

  deleteButton(description: string) {
    return this.row(description).getByRole('button', { name: `Eliminar ${description}` })
  }

  async editUrl(description: string) {
    const url = await this.editLink(description).getAttribute('href')
    if (!url) throw new Error(`Falta el enlace real de edición de ${description}.`)
    return url
  }

  async openEditor(url: string) {
    await this.page.goto(url)
  }

  async filterByType(type: ExpenseTypeFilter) {
    await this.typeFilter.selectOption(type)
  }

  async filterByCategory(category: string) {
    await this.categoryFilter.selectOption(category)
  }

  async editAmount(description: string, amount: string) {
    const edit = this.editLink(description)
    await edit.focus()
    await edit.press('Enter')
    await this.amountField.fill(amount)
    await this.saveButton.click()
    await this.page.waitForURL((url) => applicationPath(url) === this.path)
  }
}
