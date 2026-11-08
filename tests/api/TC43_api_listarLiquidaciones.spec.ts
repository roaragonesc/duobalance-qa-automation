import { test, expect } from '../../src/fixtures/endpointApi'

// Requiere API real: necesita un backend REST de testing aislado y no se puede probar en modo mock (demo de GitHub Pages).
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC43_api_listarLiquidaciones', async ({ household, settlementId }) => {
  await test.step('TC101_getSpacesIdSettlements', async () => {
    const response = await household.b.api.get(`spaces/${household.spaceId}/settlements`)
    expect(response.status()).toBe(200)
    expect((await response.json()).settlements).toEqual([
      expect.objectContaining({ _id: settlementId, amountCents: 1000 }),
    ])
  })
})
