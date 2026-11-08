import { test, expect } from '../../src/fixtures/endpointApi'

// Requiere API real: necesita un backend REST de testing aislado y no se puede probar en modo mock (demo de GitHub Pages).
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC15_api_listarEspacios', async ({ household }) => {
  await test.step('TC73_getSpaces', async () => {
    const response = await household.b.api.get('spaces')
    expect(response.status()).toBe(200)
    expect((await response.json()).spaces).toEqual([expect.objectContaining({ _id: household.spaceId })])
  })
})
