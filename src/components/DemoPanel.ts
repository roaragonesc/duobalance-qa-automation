import type { Locator, Page } from '@playwright/test'
import type { DemoUserKey } from '../data/demoUsers'

export class DemoPanel {
  readonly panel: Locator
  readonly userSelect: Locator
  readonly hideButton: Locator
  readonly showButton: Locator
  readonly resetButton: Locator
  readonly resetButtonEvenIfHidden: Locator

  constructor(private readonly page: Page) {
    this.panel = page.getByRole('complementary', { name: 'Modo mock de desarrollo' })
    this.userSelect = page.getByLabel('Usuario de prueba')
    this.hideButton = this.panel.getByRole('button', { name: 'Ocultar panel mock' })
    this.showButton = this.panel.getByRole('button', { name: 'Mostrar panel mock' })
    this.resetButton = this.panel.getByRole('button', { name: 'Restablecer datos de prueba' })
    this.resetButtonEvenIfHidden = page.getByRole('button', {
      name: 'Restablecer datos de prueba',
      includeHidden: true,
    })
  }

  async resetMockData() {
    await Promise.all([
      this.page.waitForEvent('domcontentloaded'),
      this.page.getByRole('button', { name: 'Restablecer datos de prueba' }).click(),
    ])
    await this.panel.waitFor()
  }

  async selectUser(user: DemoUserKey | null) {
    await Promise.all([
      this.page.waitForEvent('domcontentloaded'),
      this.userSelect.selectOption(user ?? ''),
    ])
    await this.panel.waitFor()
  }
}
