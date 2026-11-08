import type { Locator, Page } from '@playwright/test'
import { applicationPath } from '../utils/application'
import { BasePage } from './BasePage'

export type Registration = { name: string; email: string; password: string }

export class RegisterPage extends BasePage {
  protected readonly path = '/register'

  readonly nameField: Locator
  readonly emailField: Locator
  readonly passwordField: Locator
  readonly confirmPasswordField: Locator
  readonly submitButton: Locator
  readonly confirmEmailButton: Locator

  constructor(page: Page) {
    super(page)
    this.nameField = page.getByLabel('Nombre', { exact: true })
    this.emailField = page.getByLabel('Correo electrónico')
    this.passwordField = page.getByLabel('Contraseña', { exact: true })
    this.confirmPasswordField = page.getByLabel('Confirmar contraseña', { exact: true })
    this.submitButton = page.getByRole('button', { name: 'Crear cuenta', exact: true })
    this.confirmEmailButton = page.getByRole('button', { name: 'Confirmar mi correo' })
  }

  confirmationLink(email: string) {
    return this.page.getByRole('link', { name: `Confirmar correo de ${email}` })
  }

  async register(user: Registration, confirmation = user.password) {
    await this.nameField.fill(user.name)
    await this.emailField.fill(user.email)
    await this.passwordField.fill(user.password)
    await this.confirmPasswordField.fill(confirmation)
    await this.submitButton.click()
  }

  async confirm(email: string) {
    await this.confirmationLink(email).click()
    await this.confirmEmailButton.click()
    await this.page.waitForURL((url) => ['/onboarding', '/join'].includes(applicationPath(url)))
  }

  async openConfirmationUrl(url: string) {
    await this.page.goto(url)
    await this.confirmEmailButton.click()
  }
}
