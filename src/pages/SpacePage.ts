import type { Locator, Page } from '@playwright/test'
import { BasePage } from './BasePage'

export class SpacePage extends BasePage {
  protected readonly path = '/space'

  readonly summary: Locator
  readonly members: Locator
  readonly memberItems: Locator

  constructor(page: Page) {
    super(page)
    this.summary = page.getByRole('region', { name: 'Resumen del espacio' })
    this.members = page.getByRole('region', { name: 'Miembros', exact: true })
    this.memberItems = this.members.getByRole('listitem')
  }

  heading(name: string) {
    return this.page.getByRole('heading', { name, exact: true })
  }

  member(text: string) {
    return this.members.getByText(text)
  }
}
