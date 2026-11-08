import { test, expect, send } from '../../src/fixtures/endpointApi'

// Requiere API real: necesita un backend REST de testing aislado y no se puede probar en modo mock (demo de GitHub Pages).
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC33_api_eliminarGasto', async ({ household, expense }) => {
  await test.step('1. El usuario A elimina su gasto', async () => {
    const response = await send(household.a, 'delete', `expenses/${expense.id}`)
    expect(response.status()).toBe(204)
  })
  await test.step('2. El usuario A comprueba que el gasto ya no existe', async () => {
    expect((await household.a.api.get(`expenses/${expense.id}`)).status()).toBe(404)
  })
})
