import { test, expect, today } from '../../src/fixtures/endpointApi'
import testData from '../../src/data/testData/api/TC35_api_listarIngresos.json' with { type: 'json' }
import { defineCaseData } from '../../src/utils/caseData'

const data = defineCaseData(testData)
test.use({ caseData: data.setup })

// Requiere API real: necesita un backend REST de testing aislado y no se puede probar en modo mock (demo de GitHub Pages).

test('TC35_api_listarIngresos', async ({ household, income }) => {
  await test.step('1. El usuario B lista los ingresos del espacio en el mes actual', async () => {
    const response = await household.b.api.get('incomes', {
      params: { spaceId: household.spaceId, month: today().slice(0, 7) },
    })
    expect(response.status()).toBe(data.expected.httpStatus)
    expect((await response.json()).incomes).toEqual([
      expect.objectContaining({ id: income.id, amountCents: data.expected.amountCents, owner: data.expected.owner }),
    ])
  })
})
