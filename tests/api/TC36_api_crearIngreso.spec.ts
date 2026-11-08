import { test, expect, send, today } from '../../src/fixtures/endpointApi'
import testData from '../../src/data/testData/api/TC36_api_crearIngreso.json'
import { defineCaseData } from '../../src/utils/caseData'

const data = defineCaseData(testData)
test.use({ caseData: data.setup })

// Requiere API real: necesita un backend REST de testing aislado y no se puede probar en modo mock (demo de GitHub Pages).
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC36_api_crearIngreso', async ({ household }) => {
  await test.step('1. El usuario A crea un ingreso', async () => {
    const response = await send(household.a, 'post', 'incomes', {
      spaceId: household.spaceId,
      description: data.inputs.description,
      amountCents: data.inputs.amountCents,
      date: today(),
    })
    expect(response.status()).toBe(data.expected.httpStatus)
    expect((await response.json()).income).toMatchObject({
      createdBy: household.a.id,
      amountCents: data.expected.amountCents,
      description: data.expected.description,
    })
  })
})
