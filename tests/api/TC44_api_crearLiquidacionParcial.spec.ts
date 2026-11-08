import { test, expect, send, today } from '../../src/fixtures/endpointApi'
import testData from '../../src/data/testData/api/TC44_api_crearLiquidacionParcial.json'
import { defineCaseData } from '../../src/utils/caseData'

const data = defineCaseData(testData)
test.use({ caseData: data.setup })

// Requiere API real: necesita un backend REST de testing aislado y no se puede probar en modo mock (demo de GitHub Pages).
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC44_api_crearLiquidacionParcial', async ({ household, expense: _expense }) => {
  await test.step('1. El usuario B registra una liquidación parcial', async () => {
    const response = await send(household.b, 'post', `spaces/${household.spaceId}/settlements`, {
      date: today(),
      amountCents: data.inputs.amountCents,
      note: data.inputs.note,
    })
    expect(response.status()).toBe(data.expected.httpStatus)
    expect((await response.json()).settlement).toMatchObject({
      amountCents: data.expected.amountCents,
      fromUserId: household.b.id,
      toUserId: household.a.id,
    })
  })
  await test.step('2. El usuario A consulta el balance y comprueba la deuda acumulada restante', async () => {
    const balance = await household.a.api.get(`spaces/${household.spaceId}/balance`, {
      params: { month: today().slice(0, 7) },
    })
    expect((await balance.json()).accumulated).toEqual({
      amountCents: data.expected.amountCents2,
      debtor: data.expected.debtor,
    })
  })
})
