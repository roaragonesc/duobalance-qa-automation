import { test, expect, today } from '../../src/fixtures/endpointApi'

// Requiere API real: necesita un backend REST de testing aislado y no se puede probar en modo mock (demo de GitHub Pages).
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC35_api_listarIngresos', async ({ household, income }) => {
  await test.step('1. El usuario B lista los ingresos del espacio en el mes actual', async () => {
    const response = await household.b.api.get('incomes', {
      params: { spaceId: household.spaceId, month: today().slice(0, 7) },
    })
    expect(response.status()).toBe(200)
    expect((await response.json()).incomes).toEqual([
      expect.objectContaining({ id: income.id, amountCents: 90000, owner: 'partner' }),
    ])
  })
})
