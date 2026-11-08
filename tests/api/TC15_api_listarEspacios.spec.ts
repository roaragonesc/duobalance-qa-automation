import { test, expect } from '../../src/fixtures/endpointApi'
import testData from '../../src/data/testData/api/TC15_api_listarEspacios.json' with { type: 'json' }
import { defineCaseData } from '../../src/utils/caseData'

const data = defineCaseData(testData)
test.use({ caseData: data.setup })

// Requiere API real: necesita un backend REST de testing aislado y no se puede probar en modo mock (demo de GitHub Pages).
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC15_api_listarEspacios', async ({ household }) => {
  await test.step('1. El usuario B lista sus espacios', async () => {
    const response = await household.b.api.get('spaces')
    expect(response.status()).toBe(data.expected.httpStatus)
    expect((await response.json()).spaces).toEqual([expect.objectContaining({ _id: household.spaceId })])
  })
})
