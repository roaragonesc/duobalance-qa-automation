import { test, expect, today } from '../../src/fixtures/endpointApi'
import testData from '../../src/data/testData/api/TC34_api_listarGastosDelEspacio.json' with { type: 'json' }
import { defineCaseData } from '../../src/utils/caseData'

const data = defineCaseData(testData)
test.use({ caseData: data.setup })

// Requiere API real: necesita un backend REST de testing aislado y no se puede probar en modo mock (demo de GitHub Pages).

test('TC34_api_listarGastosDelEspacio', async ({ household, expense }) => {
  await test.step('1. El usuario B lista los gastos del espacio y comprueba los totales', async () => {
    const response = await household.b.api.get(`spaces/${household.spaceId}/expenses`, {
      params: { month: today().slice(0, 7) },
    })
    expect(response.status()).toBe(data.expected.httpStatus)
    expect(await response.json()).toMatchObject({
      expenses: [expect.objectContaining({ id: expense.id })],
      totalCents: data.expected.totalCents,
      sharedCents: data.expected.sharedCents,
      individualCents: data.expected.individualCents,
    })
  })
})
