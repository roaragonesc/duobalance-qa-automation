import { test, expect, send } from '../../src/fixtures/financeApi'
import testData from '../../src/data/testData/api/TC56_api_protegerIngresosPropios.json'
import { defineCaseData } from '../../src/utils/caseData'

const data = defineCaseData(testData)
test.use({ caseData: data.setup })

// Requiere API real: necesita un backend REST de testing aislado y no se puede probar en modo mock (demo de GitHub Pages).
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC56_api_protegerIngresosPropios', async ({ household }) => {
  const { a, b, outsider, spaceId } = household
  const input = {
    spaceId,
    description: data.inputs.description,
    amountCents: data.inputs.amountCents,
    date: new Date().toISOString().slice(0, 10),
  }
  let id = ''
  await test.step('1. El usuario A crea un ingreso', async () => {
    const created = await send(a, 'post', 'incomes', input)
    expect(created.status()).toBe(data.expected.httpStatus)
    id = (await created.json()).income._id
  })
  await test.step('2. El usuario B consulta el ingreso de A', async () => {
    expect((await b.api.get(`incomes/${id}`)).status()).toBe(data.expected.httpStatus2)
  })
  await test.step('3. Un usuario ajeno intenta consultar el ingreso y no lo encuentra', async () => {
    expect((await outsider.api.get(`incomes/${id}`)).status()).toBe(data.expected.httpStatus3)
  })
  await test.step('4. El usuario B intenta eliminar el ingreso de A y no lo encuentra', async () => {
    expect((await send(b, 'delete', `incomes/${id}`)).status()).toBe(data.expected.httpStatus3)
  })
  await test.step('5. El usuario A modifica el importe de su ingreso', async () => {
    const { spaceId: _space, ...update } = input
    expect(
      (await send(a, 'patch', `incomes/${id}`, { ...update, amountCents: data.inputs.amountCentsRequest })).status(),
    ).toBe(data.expected.httpStatus2)
  })
  await test.step('6. El usuario A elimina su ingreso', async () => {
    expect((await send(a, 'delete', `incomes/${id}`)).status()).toBe(data.expected.httpStatus4)
  })
})
