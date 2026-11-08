import type { Locator, Page, Response } from '@playwright/test'
import { BasePage } from './BasePage'

export class LoginPage extends BasePage {
  protected readonly path = '/login'

  readonly invalidCredentialsMessage = 'El correo electrónico o la contraseña no son correctos.'
  readonly heading: Locator
  readonly emailField: Locator
  readonly passwordField: Locator
  readonly signInButton: Locator
  readonly registerLink: Locator
  readonly recoverPasswordLink: Locator

  constructor(page: Page) {
    super(page)
    this.heading = page.getByRole('heading', { name: 'Login', exact: true })
    this.emailField = page.getByLabel('Correo electrónico')
    this.passwordField = page.getByLabel('Contraseña', { exact: true })
    this.signInButton = page.getByRole('button', { name: 'Iniciar sesión' })
    this.registerLink = page.getByRole('link', { name: 'Registrarse', exact: true })
    this.recoverPasswordLink = page.getByRole('link', { name: 'Recuperar contraseña' })
  }

  async visitRoot(): Promise<Response | null> {
    return this.page.goto('./')
  }

  async signIn(email: string, password: string) {
    await this.emailField.fill(email)
    await this.passwordField.fill(password)
    await this.submit()
  }

  async submit() {
    await this.signInButton.click()
  }

  async openPasswordRecovery() {
    await this.recoverPasswordLink.click()
  }
}
