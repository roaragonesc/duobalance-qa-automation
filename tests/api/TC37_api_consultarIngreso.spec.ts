import { test, expect } from '../../src/fixtures/endpointApi'

// Requiere API real: necesita un backend REST de testing aislado y no se puede probar en modo mock (demo de GitHub Pages).
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC37_api_consultarIngreso', async ({ household, income }) => {
  await test.step('1. El usuario B consulta un ingreso del espacio', async () => {
    const response = await household.b.api.get(`incomes/${income.id}`)
    expect(response.status()).toBe(200)
    expect((await response.json()).income).toMatchObject({ _id: income.id, ...income.input })
  })
})
