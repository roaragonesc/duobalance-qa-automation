import { test, expect, send } from '../../src/fixtures/endpointApi'

// Requiere API real: necesita un backend REST de testing aislado y no se puede probar en modo mock (demo de GitHub Pages).
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC33_api_eliminarGasto', async ({ household, expense }) => {
  await test.step('TC91_deleteExpensesId', async () => {
    const response = await send(household.a, 'delete', `expenses/${expense.id}`)
    expect(response.status()).toBe(204)
    expect((await household.a.api.get(`expenses/${expense.id}`)).status()).toBe(404)
  })
})
