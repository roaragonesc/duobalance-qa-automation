import { test, expect, send } from '../../src/fixtures/financeApi'

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
      description: 'Común',
      amountCents: 8000,
      date,
      kind: 'shared',
    })
    expect(expense.status()).toBe(201)
    id = (await expense.json()).expense._id
  })
  await test.step('2. El usuario A lanza dos liquidaciones simultáneas y solo una se acepta', async () => {
    const payments = await Promise.all(
      [1, 2].map(() => send(a, 'post', `spaces/${spaceId}/settlements`, { date, amountCents: 3000, note: null })),
    )
    expect(payments.map((item) => item.status()).sort()).toEqual([201, 409])
  })
  await test.step('3. El usuario A consulta el historial y comprueba que solo hay una liquidación', async () => {
    const history = await a.api.get(`spaces/${spaceId}/settlements`)
    expect((await history.json()).settlements).toHaveLength(1)
  })
  await test.step('4. El usuario A corrige el importe del gasto', async () => {
    expect(
      (
        await send(a, 'patch', `expenses/${id}`, {
          categoryId,
          description: 'Corregido',
          amountCents: 10000,
          date,
          kind: 'shared',
        })
      ).status(),
    ).toBe(200)
  })
  await test.step('5. El usuario A consulta el balance y comprueba la deuda acumulada', async () => {
    const balance = await a.api.get(`spaces/${spaceId}/balance`, { params: { month: date.slice(0, 7) } })
    expect((await balance.json()).accumulated).toEqual({ amountCents: 2000, debtor: 'partner' })
  })
  await test.step('6. El usuario A comprueba que el historial conserva una sola liquidación', async () => {
    expect((await (await a.api.get(`spaces/${spaceId}/settlements`)).json()).settlements).toHaveLength(1)
  })
})
