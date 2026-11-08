import { test, expect, today } from '../../src/fixtures/endpointApi'
import testData from '../../src/data/testData/api/TC40_api_listarIngresosDelEspacio.json' with { type: 'json' }
import { defineCaseData } from '../../src/utils/caseData'

const data = defineCaseData(testData)
test.use({ caseData: data.setup })

// Requiere API real: necesita un backend REST de testing aislado y no se puede probar en modo mock (demo de GitHub Pages).
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC40_api_listarIngresosDelEspacio', async ({ household, income }) => {
  await test.step('1. El usuario A lista los ingresos del espacio y comprueba los totales', async () => {
    const response = await household.a.api.get(`spaces/${household.spaceId}/incomes`, {
      params: { month: today().slice(0, 7) },
    })
    expect(response.status()).toBe(data.expected.httpStatus)
    expect(await response.json()).toMatchObject({
      incomes: [expect.objectContaining({ id: income.id })],
      totalCents: data.expected.totalCents,
      myCents: data.expected.myCents,
      partnerCents: data.expected.partnerCents,
    })
  })
})
