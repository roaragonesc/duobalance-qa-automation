import { test, expect } from '../../src/fixtures/endpointApi'

test('TC37_api_consultarIngreso', async ({ household, income }) => {
  await test.step('TC95_getIncomesId', async () => {
    const response = await household.b.api.get(`incomes/${income.id}`)
    expect(response.status()).toBe(200)
    expect((await response.json()).income).toMatchObject({ _id: income.id, ...income.input })
  })
})
