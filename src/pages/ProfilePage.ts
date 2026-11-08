import type { Locator, Page } from '@playwright/test'
import { BasePage } from './BasePage'

export class ProfilePage extends BasePage {
  protected readonly path = '/profile'

  readonly profileLink: Locator
  readonly signOutButton: Locator

  constructor(page: Page) {
    super(page)
    this.profileLink = page.getByRole('link', { name: 'Mi perfil' })
    this.signOutButton = page.getByRole('button', { name: 'Cerrar sesión' })
  }

  async signOut() {
    await this.profileLink.click()
    await this.signOutButton.click()
  }

  // Nombre y correo mostrados en el perfil: sirven para comprobar con que identidad se esta operando.
  nameHeading(name: string) {
    return this.page.getByRole('heading', { name, exact: true })
  }

  emailText(email: string) {
    return this.page.getByText(email, { exact: true })
  }
}
