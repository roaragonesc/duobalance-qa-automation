import { test, expect, send } from '../../src/fixtures/financeApi'
import testData from '../../src/data/testData/api/TC58_api_limitarLiquidacionesConcurrentesYConservarHistorial.json' with { type: 'json' }
import { defineCaseData } from '../../src/utils/caseData'

const data = defineCaseData(testData)
test.use({ caseData: data.setup })

// Requiere API real: necesita un backend REST de testing aislado y no se puede probar en modo mock (demo de GitHub Pages).
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC58_api_limitarLiquidacionesConcurrentesYConservarHistorial', async ({ household }) => {
  const { a, spaceId, categoryId } = household
  const date = new Date().toISOString().slice(0, 10)
  let id = ''
  await test.step('1. El usuario A crea un gasto compartido', async () => {
    const expense = await send(a, 'post', 'expenses', {
      spaceId,
      categoryId,
      description: data.inputs.description,
      amountCents: data.inputs.amountCents,
      date,
      kind: data.inputs.kind,
    })
    expect(expense.status()).toBe(data.expected.httpStatus)
    id = (await expense.json()).expense._id
  })
  await test.step('2. El usuario A lanza dos liquidaciones simultáneas y solo una se acepta', async () => {
    const payments = await Promise.all(
      [data.inputs.map, data.inputs.map2].map(() =>
        send(a, 'post', `spaces/${spaceId}/settlements`, {
          date,
          amountCents: data.inputs.amountCents3,
          note: data.inputs.note,
        }),
      ),
    )
    expect(payments.map((item) => item.status()).sort()).toEqual([data.expected.httpStatus, data.expected.httpStatus4])
  })
  await test.step('3. El usuario A consulta el historial y comprueba que solo hay una liquidación', async () => {
    const history = await a.api.get(`spaces/${spaceId}/settlements`)
    expect((await history.json()).settlements).toHaveLength(data.expected.toHaveLength)
  })
  await test.step('4. El usuario A corrige el importe del gasto', async () => {
    expect(
      (
        await send(a, 'patch', `expenses/${id}`, {
          categoryId,
          description: data.inputs.description5,
          amountCents: data.inputs.amountCents6,
          date,
          kind: data.inputs.kind,
        })
      ).status(),
    ).toBe(data.inputs.toBe)
  })
  await test.step('5. El usuario A consulta el balance y comprueba la deuda acumulada', async () => {
    const balance = await a.api.get(`spaces/${spaceId}/balance`, { params: { month: date.slice(0, 7) } })
    expect((await balance.json()).accumulated).toEqual({
      amountCents: data.expected.amountCents,
      debtor: data.expected.debtor,
    })
  })
  await test.step('6. El usuario A comprueba que el historial conserva una sola liquidación', async () => {
    expect((await (await a.api.get(`spaces/${spaceId}/settlements`)).json()).settlements).toHaveLength(
      data.expected.toHaveLength,
    )
  })
})
