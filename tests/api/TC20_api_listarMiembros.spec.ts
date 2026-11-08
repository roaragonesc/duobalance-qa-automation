import { test, expect } from '../../src/fixtures/endpointApi'
import testData from '../../src/data/testData/api/TC20_api_listarMiembros.json' with { type: 'json' }
import { defineCaseData } from '../../src/utils/caseData'

const data = defineCaseData(testData)
test.use({ caseData: data.setup })

// Requiere API real: necesita un backend REST de testing aislado y no se puede probar en modo mock (demo de GitHub Pages).

test('TC20_api_listarMiembros', async ({ household }) => {
  await test.step('1. El usuario A lista los miembros del espacio', async () => {
    const response = await household.a.api.get(`spaces/${household.spaceId}/members`)
    expect(response.status()).toBe(data.expected.httpStatus)
    expect((await response.json()).members).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ _id: household.a.id, email: household.a.email }),
        expect.objectContaining({ _id: household.b.id, email: household.b.email }),
      ]),
    )
    expect((await response.json()).members).toHaveLength(data.expected.toHaveLength)
  })
})
