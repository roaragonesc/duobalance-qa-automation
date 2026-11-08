import { test, expect, send } from '../../src/fixtures/endpointApi'

// Requiere API real: necesita un backend REST de testing aislado y no se puede probar en modo mock (demo de GitHub Pages).
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC32_api_actualizarGasto', async ({ household, expense }) => {
  await test.step('1. El usuario A actualiza el importe de su gasto', async () => {
    const response = await send(household.a, 'patch', `expenses/${expense.id}`, { ...expense.input, amountCents: 4321 })
    expect(response.status()).toBe(200)
    expect((await response.json()).expense).toMatchObject({
      _id: expense.id,
      amountCents: 4321,
      ownerBasisPoints: 5000,
    })
  })
})
