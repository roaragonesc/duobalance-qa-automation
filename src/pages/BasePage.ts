import { expect, type Locator, type Page } from '@playwright/test'
import { appRoute } from '../utils/application'

// Comportamiento realmente comun a todas las pantallas. Una sola capa de herencia.
export abstract class BasePage {
  protected abstract readonly path: string
  readonly main: Locator
  readonly alert: Locator
  readonly status: Locator

  constructor(protected readonly page: Page) {
    this.main = page.getByRole('main')
    this.alert = page.getByRole('alert')
    this.status = page.getByRole('status')
  }

  async visit() {
    await this.page.goto(appRoute(this.path))
  }

  async reload() {
    await this.page.reload()
  }

  // Comprobacion de navegacion del contrato de la pagina; las expectativas de negocio van en los specs.
  async expectOpen() {
    await expect(this.page).toHaveURL(new RegExp(`${this.path.replaceAll('/', '\\/')}$`))
  }
}
