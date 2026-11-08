import type { Locator, Page } from '@playwright/test'
import { appRoute } from '../utils/application'
import { BasePage } from './BasePage'

export type SplitChoice = 'equal' | 'proportional'

export class OnboardingPage extends BasePage {
  protected readonly path = '/onboarding'

  readonly heading: Locator
  readonly spaceNameField: Locator
  readonly createSpaceButton: Locator
  readonly inviteEmailField: Locator
  readonly createInvitationButton: Locator
  readonly invitationLink: Locator

  constructor(page: Page) {
    super(page)
    this.heading = page.getByRole('heading', { name: 'Crea tu espacio' })
    this.spaceNameField = page.getByLabel('Nombre del espacio')
    this.createSpaceButton = page.getByRole('button', { name: 'Crear espacio' })
    this.inviteEmailField = page.getByLabel('Correo electrónico')
    this.createInvitationButton = page.getByRole('button', { name: 'Crear invitación' })
    this.invitationLink = page.getByLabel('Enlace de invitación')
  }

  async visitInvitation() {
    await this.page.goto(appRoute(`${this.path}/invite`))
  }

  async createSpace(name: string, splitMethod: SplitChoice) {
    await this.spaceNameField.fill(name)
    await this.page
      .getByRole('radio', { name: splitMethod === 'equal' ? '50/50' : 'Proporcional' })
      .check()
    await this.createSpaceButton.click()
  }

  async invite(email: string) {
    await this.inviteEmailField.fill(email)
    await this.createInvitationButton.click()
  }
}
