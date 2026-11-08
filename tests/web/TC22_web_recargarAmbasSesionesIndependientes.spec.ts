import { expect, test } from '../../src/fixtures'
import { journeyUsers } from '../../src/data/journeyUsers'
import { SpacePage } from '../../src/pages/SpacePage'

test('TC22_web_recargarAmbasSesionesIndependientes', async ({
  couple: _couple, page, partnerPage,
}) => {
  const ownSpace = new SpacePage(page)
  const partnerSpace = new SpacePage(partnerPage)
  await ownSpace.visit()
  await partnerSpace.visit()

  for (const space of [ownSpace, partnerSpace]) {
    await space.reload()
    await expect(space.summary).toContainText('2 de 2')
  }
  await expect(ownSpace.member(journeyUsers.a.email)).toBeVisible()
  await expect(partnerSpace.member(journeyUsers.b.email)).toBeVisible()
})
