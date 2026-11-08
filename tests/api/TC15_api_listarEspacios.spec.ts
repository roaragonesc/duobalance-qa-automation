import { test, expect } from '../../src/fixtures/endpointApi'

test('TC15_api_listarEspacios', async ({ household }) => {
  await test.step('TC73_getSpaces', async () => {
    const response = await household.b.api.get('spaces')
    expect(response.status()).toBe(200)
    expect((await response.json()).spaces).toEqual([expect.objectContaining({ _id: household.spaceId })])
  })
})
