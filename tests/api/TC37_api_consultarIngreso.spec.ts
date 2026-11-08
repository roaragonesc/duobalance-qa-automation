import { test, expect } from '../../src/fixtures/endpointApi'
import testData from '../../src/data/testData/api/TC37_api_consultarIngreso.json' with { type: 'json' }
import { defineCaseData } from '../../src/utils/caseData'

const data = defineCaseData(testData)
test.use({ caseData: data.setup })

// Requiere API real: necesita un backend REST de testing aislado y no se puede probar en modo mock (demo de GitHub Pages).
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC37_api_consultarIngreso', async ({ household, income }) => {
  await test.step('1. El usuario B consulta un ingreso del espacio', async () => {
    const response = await household.b.api.get(`incomes/${income.id}`)
    expect(response.status()).toBe(data.expected.httpStatus)
    expect((await response.json()).income).toMatchObject({ _id: income.id, ...income.input })
  })
})
