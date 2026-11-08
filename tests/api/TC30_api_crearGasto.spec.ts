import { test, expect, send, today } from '../../src/fixtures/endpointApi'

// Requiere API real: necesita un backend REST de testing aislado y no se puede probar en modo mock (demo de GitHub Pages).
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC30_api_crearGasto', async ({ household }) => {
  await test.step('TC88_postExpenses', async () => {
    const response = await send(household.a, 'post', 'expenses', {
      spaceId: household.spaceId,
      categoryId: household.categoryId,
      description: 'Gasto nuevo',
      amountCents: 101,
      date: today(),
      kind: 'shared',
    })
    expect(response.status()).toBe(201)
    expect((await response.json()).expense).toMatchObject({
      amountCents: 101,
      ownerBasisPoints: 5000,
      createdBy: household.a.id,
    })
  })
})
