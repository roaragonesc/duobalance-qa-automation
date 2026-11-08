import type { Locator, Page } from '@playwright/test'
import { BasePage } from './BasePage'

export class ResetPasswordPage extends BasePage {
  protected readonly path = '/reset-password'

  readonly passwordField: Locator
  readonly confirmPasswordField: Locator
  readonly updateButton: Locator

  constructor(page: Page) {
    super(page)
    this.passwordField = page.getByLabel('Nueva contraseña', { exact: true })
    this.confirmPasswordField = page.getByLabel('Confirmar nueva contraseña', { exact: true })
    this.updateButton = page.getByRole('button', { name: 'Actualizar contraseña' })
  }

  async resetPassword(password: string) {
    await this.passwordField.fill(password)
    await this.confirmPasswordField.fill(password)
    await this.updateButton.click()
  }
}
