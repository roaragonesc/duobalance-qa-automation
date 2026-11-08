import { test, expect, send, today } from '../../src/fixtures/endpointApi'

// Requiere API real: necesita un backend REST de testing aislado y no se puede probar en modo mock (demo de GitHub Pages).
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC36_api_crearIngreso', async ({ household }) => {
  await test.step('1. El usuario A crea un ingreso', async () => {
    const response = await send(household.a, 'post', 'incomes', {
      spaceId: household.spaceId,
      description: 'Nómina',
      amountCents: 120000,
      date: today(),
    })
    expect(response.status()).toBe(201)
    expect((await response.json()).income).toMatchObject({
      createdBy: household.a.id,
      amountCents: 120000,
      description: 'Nómina',
    })
  })
})
