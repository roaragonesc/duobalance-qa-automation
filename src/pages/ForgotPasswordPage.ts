import { expect, type Locator, type Page } from '@playwright/test'
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

  // La demo puede re-renderizar el formulario al resolver la sesion: se reintenta hasta que se muestra el aviso.
  async requestLink(email: string) {
    await expect(async () => {
      await this.emailField.fill(email)
      await this.sendLinkButton.click()
      await expect(this.status).toBeVisible({ timeout: 3_000 })
    }).toPass({ timeout: 20_000 })
  }

  async openMockRecoveryLink(email: string) {
    await Promise.all([this.page.waitForEvent('domcontentloaded'), this.mockRecoveryLink(email).click()])
  }
}
