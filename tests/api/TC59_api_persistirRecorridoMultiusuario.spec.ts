import { test, expect, send } from '../../src/fixtures/financeApi'

// Requiere API real: necesita un backend REST de testing aislado y no se puede probar en modo mock (demo de GitHub Pages).
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC59_api_persistirRecorridoMultiusuario', async ({ household }) => {
  const { a, b, outsider, spaceId, categoryId } = household
  const date = new Date().toISOString().slice(0, 10)
  const base = { spaceId, categoryId, date, kind: 'shared', description: 'Supermercado' }
  let secretId = ''
  let gasolineCategoryId = ''
  await test.step('1. El usuario A crea un gasto compartido', async () => {
    expect((await send(a, 'post', 'expenses', { ...base, amountCents: 8000 })).status()).toBe(201)
  })
  await test.step('2. El usuario A crea un gasto individual privado', async () => {
    const secret = await send(a, 'post', 'expenses', {
      ...base,
      description: 'Privado',
      kind: 'individual',
      amountCents: 3500,
    })
    expect(secret.status()).toBe(201)
    secretId = (await secret.json()).expense._id
  })
  await test.step('3. El usuario B crea una categoría personal', async () => {
    const category = await send(b, 'post', 'categories', { name: 'Gasolina', icon: 'transport', color: '#1E5FB3' })
    expect(category.status()).toBe(201)
    gasolineCategoryId = (await category.json()).category._id
  })
  await test.step('4. El usuario B crea un gasto compartido con su categoría', async () => {
    expect(
      (
        await send(b, 'post', 'expenses', {
          ...base,
          categoryId: gasolineCategoryId,
          description: 'Gasolina',
          amountCents: 4000,
        })
      ).status(),
    ).toBe(201)
  })
  await test.step('5. Los usuarios A y B consultan el balance y comprueban la deuda acumulada', async () => {
    for (const actor of [a, b]) {
      const balance = await actor.api.get(`spaces/${spaceId}/balance`, { params: { month: date.slice(0, 7) } })
      expect(balance.status()).toBe(200)
      expect((await balance.json()).accumulated).toEqual({ amountCents: 2000, debtor: actor === a ? 'partner' : 'me' })
    }
  })
  await test.step('6. Un usuario ajeno intenta consultar el balance y no lo encuentra', async () => {
    expect(
      (await outsider.api.get(`spaces/${spaceId}/balance`, { params: { month: date.slice(0, 7) } })).status(),
    ).toBe(404)
  })
  await test.step('7. El usuario B cierra su sesión', async () => {
    expect((await send(b, 'post', 'auth/logout', {})).status()).toBe(204)
  })
  await test.step('8. El usuario B intenta consultar un gasto sin sesión y es rechazado', async () => {
    expect((await b.api.get(`expenses/${secretId}`)).status()).toBe(401)
  })
  await test.step('9. El usuario A comprueba que su sesión sigue activa', async () => {
    expect((await a.api.get('auth/me')).status()).toBe(200)
  })
  await test.step('10. El usuario B inicia sesión de nuevo', async () => {
    const logged = await b.api.post('auth/login', { data: { email: b.email, password: 'Pruebas1234!' } })
    expect(logged.status()).toBe(200)
  })
  await test.step('11. El usuario B lista los gastos del espacio y comprueba que ve dos', async () => {
    const list = await b.api.get('expenses', { params: { spaceId, month: date.slice(0, 7) } })
    expect((await list.json()).expenses).toHaveLength(2)
  })
  await test.step('12. El usuario B intenta consultar el gasto privado de A y no lo encuentra', async () => {
    expect((await b.api.get(`expenses/${secretId}`)).status()).toBe(404)
  })
})
