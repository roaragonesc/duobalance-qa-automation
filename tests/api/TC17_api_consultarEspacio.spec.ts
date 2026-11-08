import { test, expect } from '../../src/fixtures/endpointApi'

test('TC17_api_consultarEspacio', async ({ household }) => {
  await test.step('TC75_getSpacesId', async () => {
    const response = await household.b.api.get(`spaces/${household.spaceId}`)
    expect(response.status()).toBe(200)
    expect((await response.json()).space).toMatchObject({ _id: household.spaceId, members: [household.a.id, household.b.id] })
  })
})
