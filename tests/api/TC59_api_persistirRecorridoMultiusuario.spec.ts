import { test, expect, send } from '../../src/fixtures/financeApi'
import testData from '../../src/data/testData/api/TC59_api_persistirRecorridoMultiusuario.json' with { type: 'json' }
import { defineCaseData } from '../../src/utils/caseData'

const data = defineCaseData(testData)
test.use({ caseData: data.setup })

// Requiere API real: necesita un backend REST de testing aislado y no se puede probar en modo mock (demo de GitHub Pages).

test('TC59_api_persistirRecorridoMultiusuario', async ({ household }) => {
  const { a, b, outsider, spaceId, categoryId } = household
  const date = new Date().toISOString().slice(0, 10)
  const base = { spaceId, categoryId, date, kind: data.inputs.kind, description: data.inputs.description }
  let secretId = ''
  let gasolineCategoryId = ''
  await test.step('1. El usuario A crea un gasto compartido', async () => {
    expect((await send(a, 'post', 'expenses', { ...base, amountCents: data.inputs.amountCentsRequest })).status()).toBe(
      data.expected.httpStatus,
    )
  })
  await test.step('2. El usuario A crea un gasto individual privado', async () => {
    const secret = await send(a, 'post', 'expenses', {
      ...base,
      description: data.inputs.description2,
      kind: data.inputs.kindChoices.individual.kind,
      amountCents: data.inputs.amountCents,
    })
    expect(secret.status()).toBe(data.expected.httpStatus)
    secretId = (await secret.json()).expense._id
  })
  await test.step('3. El usuario B crea una categoría personal', async () => {
    const category = await send(b, 'post', 'categories', {
      name: data.inputs.name,
      icon: data.inputs.icon,
      color: data.inputs.color,
    })
    expect(category.status()).toBe(data.expected.httpStatus)
    gasolineCategoryId = (await category.json()).category._id
  })
  await test.step('4. El usuario B crea un gasto compartido con su categoría', async () => {
    expect(
      (
        await send(b, 'post', 'expenses', {
          ...base,
          categoryId: gasolineCategoryId,
          description: data.inputs.description3,
          amountCents: data.inputs.amountCents4,
        })
      ).status(),
    ).toBe(data.inputs.toBe)
  })
  await test.step('5. Los usuarios A y B consultan el balance y comprueban la deuda acumulada', async () => {
    for (const actor of [a, b]) {
      const balance = await actor.api.get(`spaces/${spaceId}/balance`, { params: { month: date.slice(0, 7) } })
      expect(balance.status()).toBe(data.expected.httpStatus6)
      expect((await balance.json()).accumulated).toEqual({
        amountCents: data.expected.amountCents7,
        debtor: actor === a ? data.expected.toEqual : data.expected.toEqual8,
      })
    }
  })
  await test.step('6. Un usuario ajeno intenta consultar el balance y no lo encuentra', async () => {
    expect(
      (await outsider.api.get(`spaces/${spaceId}/balance`, { params: { month: date.slice(0, 7) } })).status(),
    ).toBe(data.inputs.toBe9)
  })
  await test.step('7. El usuario B cierra su sesión', async () => {
    expect((await send(b, 'post', 'auth/logout', {})).status()).toBe(data.expected.httpStatus10)
  })
  await test.step('8. El usuario B intenta consultar un gasto sin sesión y es rechazado', async () => {
    expect((await b.api.get(`expenses/${secretId}`)).status()).toBe(data.expected.httpStatus11)
  })
  await test.step('9. El usuario A comprueba que su sesión sigue activa', async () => {
    expect((await a.api.get('auth/me')).status()).toBe(data.expected.httpStatus6)
  })
  await test.step('10. El usuario B inicia sesión de nuevo', async () => {
    const logged = await b.api.post('auth/login', { data: { email: b.email, password: data.inputs.password } })
    expect(logged.status()).toBe(data.expected.httpStatus6)
  })
  await test.step('11. El usuario B lista los gastos del espacio y comprueba que ve dos', async () => {
    const list = await b.api.get('expenses', { params: { spaceId, month: date.slice(0, 7) } })
    expect((await list.json()).expenses).toHaveLength(data.expected.toHaveLength)
  })
  await test.step('12. El usuario B intenta consultar el gasto privado de A y no lo encuentra', async () => {
    expect((await b.api.get(`expenses/${secretId}`)).status()).toBe(data.expected.httpStatus12)
  })
})
