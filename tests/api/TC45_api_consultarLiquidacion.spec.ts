import { test, expect } from '../../src/fixtures/endpointApi'

// Requiere API real: necesita un backend REST de testing aislado y no se puede probar en modo mock (demo de GitHub Pages).
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC45_api_consultarLiquidacion', async ({ household, settlementId }) => {
  await test.step('1. El usuario B consulta una liquidación del espacio', async () => {
    const response = await household.b.api.get(`settlements/${settlementId}`)
    expect(response.status()).toBe(200)
    expect((await response.json()).settlement).toMatchObject({
      _id: settlementId,
      amountCents: 1000,
      note: 'Pago endpoint',
    })
  })
})
