import type { Locator, Page } from '@playwright/test'
import { BasePage } from './BasePage'

export class ForgotPasswordPage extends BasePage {
  protected readonly path = '/forgot-password'

  readonly heading: Locator
  readonly emailField: Locator
  readonly sendLinkButton: Locator

  constructor(page: Page) {
    super(page)
    this.heading = page.getByRole('heading', { name: '¿Has olvidado tu contraseña?' })
    this.emailField = page.getByLabel('Correo electrónico')
    this.sendLinkButton = page.getByRole('button', { name: 'Enviar enlace' })
  }

  mockRecoveryLink(email: string) {
    return this.page.getByRole('button', { name: `Abrir recuperación de ${email}` })
  }

  async requestLink(email: string) {
    await this.emailField.fill(email)
    await this.sendLinkButton.click()
  }

  async openMockRecoveryLink(email: string) {
    await this.mockRecoveryLink(email).click()
  }
}
