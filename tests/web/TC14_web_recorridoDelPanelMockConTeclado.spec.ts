import { expect, test } from '../../src/fixtures'
import testData from '../../src/data/testData/web/TC14_web_recorridoDelPanelMockConTeclado.json' with { type: 'json' }
import { defineCaseData } from '../../src/utils/caseData'

const data = defineCaseData(testData)
test.use({ caseData: data.setup })

test('TC14_web_recorridoDelPanelMockConTeclado', async ({ demoPanel }) => {
  await test.step('1. El usuario oculta los controles del panel mock con el teclado', async () => {
    await expect(demoPanel.hideButton).toHaveAttribute('aria-expanded', data.expected.toHaveAttribute)
    await expect(demoPanel.userSelect).toBeVisible()
    await demoPanel.hideButton.focus()
    await demoPanel.hideButton.press('Enter')
    await expect(demoPanel.showButton).toBeFocused()
    await expect(demoPanel.showButton).toHaveAttribute('aria-expanded', data.expected.toHaveAttribute1)
    await expect(demoPanel.userSelect).toBeHidden()
    await expect(demoPanel.resetButtonEvenIfHidden).toBeHidden()
  })

  await test.step('2. El usuario vuelve a mostrar los controles con la barra espaciadora', async () => {
    await demoPanel.showButton.press('Space')
    await expect(demoPanel.hideButton).toBeFocused()
    await expect(demoPanel.hideButton).toHaveAttribute('aria-expanded', data.expected.toHaveAttribute)
    await expect(demoPanel.userSelect).toBeVisible()
    await expect(demoPanel.resetButton).toBeVisible()
  })
})
