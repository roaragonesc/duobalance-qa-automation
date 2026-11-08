import { test, expect } from '../../src/fixtures/endpointApi'
import testData from '../../src/data/testData/api/TC43_api_listarLiquidaciones.json'
import { defineCaseData } from '../../src/utils/caseData'

const data = defineCaseData(testData)
test.use({ caseData: data.setup })

// Requiere API real: necesita un backend REST de testing aislado y no se puede probar en modo mock (demo de GitHub Pages).
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC43_api_listarLiquidaciones', async ({ household, settlementId }) => {
  await test.step('1. El usuario B lista las liquidaciones del espacio', async () => {
    const response = await household.b.api.get(`spaces/${household.spaceId}/settlements`)
    expect(response.status()).toBe(data.expected.httpStatus)
    expect((await response.json()).settlements).toEqual([
      expect.objectContaining({ _id: settlementId, amountCents: data.expected.amountCents }),
    ])
  })
})
