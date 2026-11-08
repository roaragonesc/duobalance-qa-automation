import { expect, test } from '../../src/fixtures'
import { journeyUsers } from '../../src/data/journeyUsers'
import { SpacePage } from '../../src/pages/SpacePage'

test('TC56_web_confirmarEspacioCompartidoEIdentidadesDistintas', async ({
  couple: _couple, page, partnerPage,
}) => {
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
