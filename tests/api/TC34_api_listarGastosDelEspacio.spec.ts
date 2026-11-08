import { test, expect, today } from '../../src/fixtures/endpointApi'

// Requiere API real: necesita un backend REST de testing aislado y no se puede probar en modo mock (demo de GitHub Pages).
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC34_api_listarGastosDelEspacio', async ({ household, expense }) => {
  await test.step('TC92_getSpacesIdExpenses', async () => {
    const response = await household.b.api.get(`spaces/${household.spaceId}/expenses`, {
      params: { month: today().slice(0, 7) },
    })
    expect(response.status()).toBe(200)
    expect(await response.json()).toMatchObject({
      expenses: [expect.objectContaining({ id: expense.id })],
      totalCents: 8000,
      sharedCents: 8000,
      individualCents: 0,
    })
  })
})
