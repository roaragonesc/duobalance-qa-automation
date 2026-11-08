import { expect, test } from '../../src/fixtures'
import { SpacePage } from '../../src/pages/SpacePage'

// Requiere API real: necesita dos sesiones con datos compartidos y no se puede probar en modo mock.
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC15_web_consultarElMismoEspacioEnAmbosContextos', async ({ couple: _couple, page, partnerPage }) => {
  for (const actor of [page, partnerPage]) {
    const space = new SpacePage(actor)
    await space.visit()
    await expect(space.heading('Hogar E2E')).toBeVisible()
    await expect(space.members).toContainText('Ana')
    await expect(space.members).toContainText('Luis')
    await expect(space.summary).toContainText('2 de 2')
  }
})
