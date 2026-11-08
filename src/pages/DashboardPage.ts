import type { Locator, Page } from '@playwright/test'
import { BasePage } from './BasePage'

export class DashboardPage extends BasePage {
  protected readonly path = '/dashboard'

  readonly noExpensesHeading: Locator

  constructor(page: Page) {
    super(page)
    this.noExpensesHeading = page.getByRole('heading', { name: /Todavía no hay gastos en/ })
  }
}
