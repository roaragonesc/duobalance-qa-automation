import { test, expect, send } from '../../src/fixtures/endpointApi'

test('TC32_api_actualizarGasto', async ({ household, expense }) => {
  await test.step('TC90_patchExpensesId', async () => {
    const response = await send(household.a, 'patch', `expenses/${expense.id}`, { ...expense.input, amountCents: 4321 })
    expect(response.status()).toBe(200)
    expect((await response.json()).expense).toMatchObject({ _id: expense.id, amountCents: 4321, ownerBasisPoints: 5000 })
  })
})
