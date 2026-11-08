import type { Locator, Page } from '@playwright/test'

export type AppSection = 'Inicio' | 'Gastos' | 'Ingresos' | 'Balance' | 'Espacio' | 'Mi perfil'

export class AppNavigation {
  readonly skipLink: Locator

  constructor(private readonly page: Page) {
    this.skipLink = page.getByRole('link', { name: 'Saltar al contenido' })
  }

  link(section: AppSection) {
    return this.page.getByRole('link', { name: section, exact: true })
  }

  async open(section: AppSection) {
    await this.link(section).click()
  }
}
