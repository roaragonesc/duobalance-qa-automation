import type { Locator, Page } from '@playwright/test'
import { applicationPath } from '../utils/application'
import { BasePage } from './BasePage'

type IncomeInput = {
  description: string
  amount: string
}

export class IncomesPage extends BasePage {
  protected readonly path = '/incomes'

  readonly noIncomesHeading: Locator
  readonly ownerFilter: Locator
  readonly shareRegion: Locator
  readonly incomesList: Locator
  readonly addLink: Locator
  readonly conceptField: Locator
  readonly amountField: Locator
  readonly submitButton: Locator

  constructor(page: Page) {
    super(page)
    this.noIncomesHeading = page.getByRole('heading', { name: /Todavía no hay ingresos en/ })
    this.ownerFilter = page.getByLabel('Miembro', { exact: true })
    this.shareRegion = page.getByRole('region', { name: 'Reparto de aportaciones', exact: true })
    this.incomesList = page.getByRole('region', { name: 'Listado de ingresos', exact: true })
    this.addLink = page.getByRole('link', { name: 'Añadir ingreso' })
    this.conceptField = page.getByLabel('Concepto')
    this.amountField = page.getByLabel('Importe (€)')
    this.submitButton = page.getByRole('button', { name: 'Añadir ingreso' })
  }

  async addIncome({ description, amount }: IncomeInput) {
    await this.addLink.click()
    await this.conceptField.fill(description)
    await this.amountField.fill(amount)
    await this.submitButton.click()
    await this.page.waitForURL((url) => applicationPath(url) === this.path)
  }

  row(description: string) {
    return this.page.getByRole('row').filter({
      has: this.page.getByRole('rowheader', { name: description, exact: true }),
    })
  }

  editLink(description: string) {
    return this.row(description).getByRole('link', { name: `Editar ${description}` })
  }

  deleteButton(description: string) {
    return this.row(description).getByRole('button', { name: `Eliminar ${description}` })
  }
}
