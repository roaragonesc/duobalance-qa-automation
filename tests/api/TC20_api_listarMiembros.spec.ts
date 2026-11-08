import { test, expect } from '../../src/fixtures/endpointApi'

test('TC20_api_listarMiembros', async ({ household }) => {
  await test.step('TC78_getSpacesIdMembers', async () => {
    const response = await household.a.api.get(`spaces/${household.spaceId}/members`)
    expect(response.status()).toBe(200)
    expect((await response.json()).members).toEqual(expect.arrayContaining([
      expect.objectContaining({ _id: household.a.id, email: household.a.email }),
      expect.objectContaining({ _id: household.b.id, email: household.b.email }),
    ]))
    expect((await response.json()).members).toHaveLength(2)
  })
})
