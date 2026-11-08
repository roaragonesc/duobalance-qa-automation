import { expect, test } from '../../src/fixtures'

test('TC14_web_recorridoDelPanelMockConTeclado', async ({ demoPanel }) => {
  await test.step('1. El usuario oculta los controles del panel mock con el teclado', async () => {
    await expect(demoPanel.hideButton).toHaveAttribute('aria-expanded', 'true')
    await expect(demoPanel.userSelect).toBeVisible()
    await demoPanel.hideButton.focus()
    await demoPanel.hideButton.press('Enter')
    await expect(demoPanel.showButton).toBeFocused()
    await expect(demoPanel.showButton).toHaveAttribute('aria-expanded', 'false')
    await expect(demoPanel.userSelect).toBeHidden()
    await expect(demoPanel.resetButtonEvenIfHidden).toBeHidden()
  })

  await test.step('2. El usuario vuelve a mostrar los controles con la barra espaciadora', async () => {
    await demoPanel.showButton.press('Space')
    await expect(demoPanel.hideButton).toBeFocused()
    await expect(demoPanel.hideButton).toHaveAttribute('aria-expanded', 'true')
    await expect(demoPanel.userSelect).toBeVisible()
    await expect(demoPanel.resetButton).toBeVisible()
  })
})
