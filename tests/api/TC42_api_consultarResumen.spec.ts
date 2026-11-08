import { test, expect, today } from '../../src/fixtures/endpointApi'

// Requiere API real: necesita un backend REST de testing aislado y no se puede probar en modo mock (demo de GitHub Pages).
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC42_api_consultarResumen', async ({ household, expense: _expense }) => {
  await test.step('1. El usuario A consulta el resumen del espacio', async () => {
    const response = await household.a.api.get(`spaces/${household.spaceId}/summary`, {
      params: { month: today().slice(0, 7) },
    })
    expect(response.status()).toBe(200)
    expect(await response.json()).toMatchObject({
      totalCents: 8000,
      pending: { amountCents: 4000, debtor: 'partner' },
      recentExpenses: [expect.objectContaining({ amountCents: 8000 })],
    })
  })
})
