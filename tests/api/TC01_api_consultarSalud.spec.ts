import { test, expect } from '../../src/fixtures/endpointApi'
import testData from '../../src/data/testData/api/TC01_api_consultarSalud.json' with { type: 'json' }
import { defineCaseData } from '../../src/utils/caseData'

const data = defineCaseData(testData)
test.use({ caseData: data.setup })

// Requiere API real: necesita un backend REST de testing aislado y no se puede probar en modo mock (demo de GitHub Pages).

test('TC01_api_consultarSalud', async ({ request }) => {
  await test.step('1. El cliente consulta el estado de salud del servicio', async () => {
    const response = await request.get('health')
    expect(response.status()).toBe(data.expected.httpStatus)
    expect(await response.json()).toEqual({ status: data.expected.status })
  })
})
