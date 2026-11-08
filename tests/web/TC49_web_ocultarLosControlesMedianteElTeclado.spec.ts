import { expect, test } from '../../src/fixtures'

test('TC49_web_ocultarLosControlesMedianteElTeclado', async ({ demoPanel }) => {
  await expect(demoPanel.hideButton).toHaveAttribute('aria-expanded', 'true')
  await expect(demoPanel.userSelect).toBeVisible()
  await demoPanel.hideButton.focus()
  await demoPanel.hideButton.press('Enter')
  await expect(demoPanel.showButton).toBeFocused()
  await expect(demoPanel.showButton).toHaveAttribute('aria-expanded', 'false')
  await expect(demoPanel.userSelect).toBeHidden()
  await expect(demoPanel.resetButtonEvenIfHidden).toBeHidden()
})
