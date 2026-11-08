import { test, expect, send } from '../../src/fixtures/endpointApi'

test('TC33_api_eliminarGasto', async ({ household, expense }) => {
  await test.step('TC91_deleteExpensesId', async () => {
    const response = await send(household.a, 'delete', `expenses/${expense.id}`)
    expect(response.status()).toBe(204)
    expect((await household.a.api.get(`expenses/${expense.id}`)).status()).toBe(404)
  })
})
