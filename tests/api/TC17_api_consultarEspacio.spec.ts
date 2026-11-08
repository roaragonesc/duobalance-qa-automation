import { test, expect } from '../../src/fixtures/endpointApi'
import testData from '../../src/data/testData/api/TC17_api_consultarEspacio.json' with { type: 'json' }
import { defineCaseData } from '../../src/utils/caseData'

const data = defineCaseData(testData)
test.use({ caseData: data.setup })

// Requiere API real: necesita un backend REST de testing aislado y no se puede probar en modo mock (demo de GitHub Pages).

test('TC17_api_consultarEspacio', async ({ household }) => {
  await test.step('1. El usuario B consulta el espacio y comprueba los miembros', async () => {
    const response = await household.b.api.get(`spaces/${household.spaceId}`)
    expect(response.status()).toBe(data.expected.httpStatus)
    expect((await response.json()).space).toMatchObject({
      _id: household.spaceId,
      members: [household.a.id, household.b.id],
    })
  })
})
