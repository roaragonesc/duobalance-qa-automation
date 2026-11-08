import { test, expect, today } from '../../src/fixtures/endpointApi'

// Requiere API real: necesita un backend REST de testing aislado y no se puede probar en modo mock (demo de GitHub Pages).
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC41_api_consultarBalance', async ({ household, expense: _expense }) => {
  await test.step('1. El usuario A consulta el balance del espacio', async () => {
    const response = await household.a.api.get(`spaces/${household.spaceId}/balance`, {
      params: { month: today().slice(0, 7) },
    })
    expect(response.status()).toBe(200)
    expect(await response.json()).toMatchObject({
      month: { amountCents: 4000, debtor: 'partner' },
      accumulated: { amountCents: 4000, debtor: 'partner' },
    })
  })
})
