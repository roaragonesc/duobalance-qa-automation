import { test, expect, send } from '../../src/fixtures/financeApi'

// Requiere API real: necesita un backend REST de testing aislado y no se puede probar en modo mock (demo de GitHub Pages).
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC56_api_protegerIngresosPropios', async ({ household }) => {
  const { a, b, outsider, spaceId } = household
  const input = { spaceId, description: 'Nómina', amountCents: 210000, date: new Date().toISOString().slice(0, 10) }
  let id = ''
  await test.step('1. El usuario A crea un ingreso', async () => {
    const created = await send(a, 'post', 'incomes', input)
    expect(created.status()).toBe(201)
    id = (await created.json()).income._id
  })
  await test.step('2. El usuario B consulta el ingreso de A', async () => {
    expect((await b.api.get(`incomes/${id}`)).status()).toBe(200)
  })
  await test.step('3. Un usuario ajeno intenta consultar el ingreso y no lo encuentra', async () => {
    expect((await outsider.api.get(`incomes/${id}`)).status()).toBe(404)
  })
  await test.step('4. El usuario B intenta eliminar el ingreso de A y no lo encuentra', async () => {
    expect((await send(b, 'delete', `incomes/${id}`)).status()).toBe(404)
  })
  await test.step('5. El usuario A modifica el importe de su ingreso', async () => {
    const { spaceId: _space, ...update } = input
    expect((await send(a, 'patch', `incomes/${id}`, { ...update, amountCents: 220000 })).status()).toBe(200)
  })
  await test.step('6. El usuario A elimina su ingreso', async () => {
    expect((await send(a, 'delete', `incomes/${id}`)).status()).toBe(204)
  })
})
