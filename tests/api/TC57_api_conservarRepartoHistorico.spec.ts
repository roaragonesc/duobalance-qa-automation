import { test, expect, send } from '../../src/fixtures/financeApi'
import testData from '../../src/data/testData/api/TC57_api_conservarRepartoHistorico.json' with { type: 'json' }
import { defineCaseData } from '../../src/utils/caseData'

const data = defineCaseData(testData)
test.use({ caseData: data.setup })

// Requiere API real: necesita un backend REST de testing aislado y no se puede probar en modo mock (demo de GitHub Pages).

test('TC57_api_conservarRepartoHistorico', async ({ household }) => {
  const { a, b, spaceId, categoryId } = household
  const date = new Date().toISOString().slice(0, 10)
  await test.step('1. El usuario A cambia el reparto del espacio a proporcional', async () => {
    expect((await send(a, 'patch', `spaces/${spaceId}`, { splitMethod: data.inputs.splitMethod })).status()).toBe(
      data.expected.httpStatus,
    )
  })
  await test.step('2. Los usuarios A y B registran sus ingresos del mes', async () => {
    for (const [actor, amountCents] of [
      [a, data.inputs.value],
      [b, data.inputs.value2],
    ] as const) {
      expect(
        (
          await send(actor, 'post', 'incomes', { spaceId, description: data.inputs.description, amountCents, date })
        ).status(),
      ).toBe(data.inputs.toBe)
    }
  })
  await test.step('3. El usuario A crea un gasto compartido y comprueba el reparto proporcional', async () => {
    const expense = await send(a, 'post', 'expenses', {
      spaceId,
      categoryId,
      description: data.inputs.description3,
      amountCents: data.inputs.amountCents,
      date,
      kind: data.inputs.kind,
    })
    expect(expense.status()).toBe(data.expected.httpStatus4)
    expect((await expense.json()).expense.ownerBasisPoints).toBe(data.expected.toBe)
  })
  await test.step('4. El usuario A vuelve a cambiar el reparto del espacio a equitativo', async () => {
    expect(
      (
        await send(a, 'patch', `spaces/${spaceId}`, { splitMethod: data.inputs.splitMethodChoices.equal.splitMethod })
      ).status(),
    ).toBe(data.expected.httpStatus)
  })
  await test.step('5. El usuario B registra un ingreso extra', async () => {
    expect(
      (
        await send(b, 'post', 'incomes', {
          spaceId,
          description: data.inputs.description5,
          amountCents: data.inputs.amountCents6,
          date,
        })
      ).status(),
    ).toBe(data.inputs.toBe)
  })
  await test.step('6. El usuario A consulta el balance y comprueba que conserva el reparto histórico', async () => {
    const balance = await a.api.get(`spaces/${spaceId}/balance`, { params: { month: date.slice(0, 7) } })
    expect(balance.status()).toBe(data.expected.httpStatus)
    expect((await balance.json()).accumulated).toEqual({
      amountCents: data.expected.amountCents,
      debtor: data.expected.debtor,
    })
  })
})
