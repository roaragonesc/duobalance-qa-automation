import { test, expect, send } from '../../src/fixtures/endpointApi'

// Requiere API real: necesita un backend REST de testing aislado y no se puede probar en modo mock (demo de GitHub Pages).
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC38_api_actualizarIngreso', async ({ household, income }) => {
  await test.step('TC96_patchIncomesId', async () => {
    const response = await send(household.a, 'patch', `incomes/${income.id}`, { ...income.input, amountCents: 123000 })
    expect(response.status()).toBe(200)
    expect((await response.json()).income).toMatchObject({ _id: income.id, amountCents: 123000 })
  })
})
