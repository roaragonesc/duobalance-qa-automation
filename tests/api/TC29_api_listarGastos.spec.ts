import { test, expect, today } from '../../src/fixtures/endpointApi'

// Requiere API real: necesita un backend REST de testing aislado y no se puede probar en modo mock (demo de GitHub Pages).
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC29_api_listarGastos', async ({ household, expense }) => {
  await test.step('TC87_getExpenses', async () => {
    const response = await household.b.api.get('expenses', {
      params: { spaceId: household.spaceId, month: today().slice(0, 7) },
    })
    expect(response.status()).toBe(200)
    expect((await response.json()).expenses).toEqual([
      expect.objectContaining({ id: expense.id, amountCents: 8000, canEdit: false }),
    ])
  })
})
