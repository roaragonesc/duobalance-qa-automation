import { test, expect } from '../../src/fixtures/endpointApi'

// Requiere API real: necesita un backend REST de testing aislado y no se puede probar en modo mock (demo de GitHub Pages).
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC31_api_consultarGasto', async ({ household, expense }) => {
  await test.step('1. El usuario B consulta un gasto del espacio', async () => {
    const response = await household.b.api.get(`expenses/${expense.id}`)
    expect(response.status()).toBe(200)
    expect((await response.json()).expense).toMatchObject({ _id: expense.id, ...expense.input })
  })
})
