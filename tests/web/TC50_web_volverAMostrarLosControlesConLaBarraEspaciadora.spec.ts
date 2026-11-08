import { expect, test } from '../../src/fixtures'

test('TC50_web_volverAMostrarLosControlesConLaBarraEspaciadora', async ({ demoPanel }) => {
  await demoPanel.hideButton.focus()
  await demoPanel.hideButton.press('Enter')
  await expect(demoPanel.showButton).toBeFocused()

  await demoPanel.showButton.press('Space')
  await expect(demoPanel.hideButton).toBeFocused()
  await expect(demoPanel.hideButton).toHaveAttribute('aria-expanded', 'true')
  await expect(demoPanel.userSelect).toBeVisible()
  await expect(demoPanel.resetButton).toBeVisible()
})
