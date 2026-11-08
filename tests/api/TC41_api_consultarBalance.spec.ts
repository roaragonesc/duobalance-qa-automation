import { test, expect, today } from '../../src/fixtures/endpointApi'
import testData from '../../src/data/testData/api/TC41_api_consultarBalance.json'
import { defineCaseData } from '../../src/utils/caseData'

const data = defineCaseData(testData)
test.use({ caseData: data.setup })

// Requiere API real: necesita un backend REST de testing aislado y no se puede probar en modo mock (demo de GitHub Pages).
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC41_api_consultarBalance', async ({ household, expense: _expense }) => {
  await test.step('1. El usuario A consulta el balance del espacio', async () => {
    const response = await household.a.api.get(`spaces/${household.spaceId}/balance`, {
      params: { month: today().slice(0, 7) },
    })
    expect(response.status()).toBe(data.expected.httpStatus)
    expect(await response.json()).toMatchObject({
      month: { amountCents: data.expected.amountCents, debtor: data.expected.debtor },
      accumulated: { amountCents: data.expected.amountCents, debtor: data.expected.debtor },
    })
  })
})
