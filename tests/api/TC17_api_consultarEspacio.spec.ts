import { test, expect } from '../../src/fixtures/endpointApi'

// Requiere API real: necesita un backend REST de testing aislado y no se puede probar en modo mock (demo de GitHub Pages).
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC17_api_consultarEspacio', async ({ household }) => {
  await test.step('TC75_getSpacesId', async () => {
    const response = await household.b.api.get(`spaces/${household.spaceId}`)
    expect(response.status()).toBe(200)
    expect((await response.json()).space).toMatchObject({
      _id: household.spaceId,
      members: [household.a.id, household.b.id],
    })
  })
})
