import type { Locator, Page } from '@playwright/test'
import { BasePage } from './BasePage'

export class BalancePage extends BasePage {
  protected readonly path = '/balance'

  readonly noBalanceHeading: Locator
  readonly debtSummary: Locator
  readonly monthSummary: Locator
  readonly ownContribution: Locator
  readonly monthBalance: Locator

  constructor(page: Page) {
    super(page)
    this.noBalanceHeading = page.getByRole('heading', { name: /Todavía no hay balance en/ })
    this.debtSummary = page.getByRole('region', { name: '¿Quién debe a quién?' })
    this.monthSummary = page.getByRole('region', { name: /Resumen de/ })
    this.ownContribution = page.getByRole('region', { name: 'Tu aportación', exact: true })
    this.monthBalance = page.getByRole('region', { name: 'Saldo del mes', exact: true })
  }
}
