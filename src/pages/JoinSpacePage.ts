import type { Locator, Page } from '@playwright/test'
import { BasePage } from './BasePage'

export class JoinSpacePage extends BasePage {
  protected readonly path = '/join'

  readonly acceptButton: Locator
  readonly createAccountLink: Locator

  constructor(page: Page) {
    super(page)
    this.acceptButton = page.getByRole('button', { name: 'Aceptar invitación' })
    this.createAccountLink = page.getByRole('link', { name: 'Crear una cuenta' })
  }

  async open(invitationUrl: string) {
    await this.page.goto(invitationUrl)
  }

  async accept() {
    await this.acceptButton.click()
  }
}
