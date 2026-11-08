import { expect, test } from '../../src/fixtures'
import { journeyUsers } from '../../src/data/journeyUsers'
import { SpacePage } from '../../src/pages/SpacePage'

// Requiere API real: necesita dos sesiones con datos compartidos y no se puede probar en modo mock.
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC40_web_confirmarEspacioCompartidoEIdentidadesDistintas', async ({ couple: _couple, page, partnerPage }) => {
  const ownSpace = new SpacePage(page)
  const partnerSpace = new SpacePage(partnerPage)
  for (const space of [ownSpace, partnerSpace]) {
    await space.visit()
    await expect(space.heading('Hogar E2E')).toBeVisible()
    await expect(space.summary).toContainText('2 de 2')
  }
  await expect(ownSpace.members).toContainText(journeyUsers.a.email)
  await expect(partnerSpace.members).toContainText(journeyUsers.b.email)
})
