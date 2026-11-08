import { test, expect } from '../../src/fixtures/endpointApi'
import testData from '../../src/data/testData/api/TC31_api_consultarGasto.json' with { type: 'json' }
import { defineCaseData } from '../../src/utils/caseData'

const data = defineCaseData(testData)
test.use({ caseData: data.setup })

// Requiere API real: necesita un backend REST de testing aislado y no se puede probar en modo mock (demo de GitHub Pages).

test('TC31_api_consultarGasto', async ({ household, expense }) => {
  await test.step('1. El usuario B consulta un gasto del espacio', async () => {
    const response = await household.b.api.get(`expenses/${expense.id}`)
    expect(response.status()).toBe(data.expected.httpStatus)
    expect((await response.json()).expense).toMatchObject({ _id: expense.id, ...expense.input })
  })
})
