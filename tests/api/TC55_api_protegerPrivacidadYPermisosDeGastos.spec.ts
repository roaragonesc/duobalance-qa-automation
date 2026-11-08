import { test, expect, send } from '../../src/fixtures/financeApi'

// Requiere API real: necesita un backend REST de testing aislado y no se puede probar en modo mock (demo de GitHub Pages).
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC55_api_protegerPrivacidadYPermisosDeGastos', async ({ household }) => {
  const date = new Date().toISOString().slice(0, 10)
  const { a, b, outsider, spaceId, categoryId } = household
  const input = { spaceId, categoryId, description: 'Común', amountCents: 8000, date, kind: 'shared' }
  let id = ''
  let privateId = ''
  await test.step('1. El usuario A crea un gasto compartido', async () => {
    const shared = await send(a, 'post', 'expenses', input)
    expect(shared.status()).toBe(201)
    id = (await shared.json()).expense._id
  })
  await test.step('2. El usuario A crea un gasto individual privado', async () => {
    const secret = await send(a, 'post', 'expenses', {
      ...input,
      description: 'Privado',
      kind: 'individual',
      amountCents: 3500,
    })
    expect(secret.status()).toBe(201)
    privateId = (await secret.json()).expense._id
  })
  await test.step('3. El usuario B intenta consultar el gasto privado y no lo encuentra', async () => {
    expect((await b.api.get(`expenses/${privateId}`)).status()).toBe(404)
  })
  await test.step('4. Un usuario ajeno intenta consultar el gasto compartido y no lo encuentra', async () => {
    expect((await outsider.api.get(`expenses/${id}`)).status()).toBe(404)
  })
  await test.step('5. El usuario B intenta eliminar el gasto de A y no lo encuentra', async () => {
    expect((await send(b, 'delete', `expenses/${id}`)).status()).toBe(404)
  })
  await test.step('6. El usuario B lista los gastos del espacio y solo ve el compartido', async () => {
    const list = await b.api.get(`spaces/${spaceId}/expenses`, { params: { month: date.slice(0, 7) } })
    expect(list.status()).toBe(200)
    expect((await list.json()).expenses.map((item: { id: string }) => item.id)).toEqual([id])
  })
  await test.step('7. El usuario A intenta eliminar la categoría en uso y es rechazado', async () => {
    expect((await send(a, 'delete', `categories/${categoryId}`)).status()).toBe(409)
  })
  await test.step('8. El usuario A intenta eliminar el espacio con gastos y es rechazado', async () => {
    expect((await send(a, 'delete', `spaces/${spaceId}`)).status()).toBe(409)
  })
  const { spaceId: _space, ...update } = input
  await test.step('9. El usuario B intenta modificar el gasto de A y no lo encuentra', async () => {
    expect((await send(b, 'patch', `expenses/${id}`, { ...update, amountCents: 10000 })).status()).toBe(404)
  })
  await test.step('10. El usuario A modifica el importe de su gasto', async () => {
    expect((await send(a, 'patch', `expenses/${id}`, { ...update, amountCents: 10000 })).status()).toBe(200)
  })
  await test.step('11. El usuario A intenta crear un gasto con un importe decimal y es rechazado', async () => {
    expect((await send(a, 'post', 'expenses', { ...input, amountCents: 1.5 })).status()).toBe(400)
  })
  await test.step('12. El usuario A intenta crear un gasto con una fecha inexistente y es rechazado', async () => {
    expect((await send(a, 'post', 'expenses', { ...input, date: '2026-02-31' })).status()).toBe(400)
  })
  await test.step('13. El usuario A elimina su gasto compartido', async () => {
    expect((await send(a, 'delete', `expenses/${id}`)).status()).toBe(204)
  })
})
