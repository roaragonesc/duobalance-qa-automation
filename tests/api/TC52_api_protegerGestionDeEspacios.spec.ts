import { test, expect, send } from '../../src/fixtures/financeApi'

// Requiere API real: necesita un backend REST de testing aislado y no se puede probar en modo mock (demo de GitHub Pages).
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC52_api_protegerGestionDeEspacios', async ({ actors }) => {
  const { a, b } = actors
  let id = ''
  await test.step('1. El usuario A crea un espacio nuevo', async () => {
    const created = await send(a, 'post', 'spaces', { name: 'Hogar vacío', splitMethod: 'equal' })
    expect(created.status()).toBe(201)
    id = (await created.json()).space._id
  })
  await test.step('2. El usuario A intenta crear un segundo espacio y es rechazado', async () => {
    expect((await send(a, 'post', 'spaces', { name: 'Duplicado', splitMethod: 'equal' })).status()).toBe(409)
  })
  await test.step('3. El usuario B intenta consultar el espacio ajeno y no lo encuentra', async () => {
    expect((await b.api.get(`spaces/${id}`)).status()).toBe(404)
  })
  await test.step('4. El usuario A cambia el nombre del espacio', async () => {
    expect((await send(a, 'patch', `spaces/${id}`, { name: 'Nuevo nombre' })).status()).toBe(200)
  })
  await test.step('5. El usuario A consulta el espacio y comprueba el nombre nuevo', async () => {
    const detail = await a.api.get(`spaces/${id}`)
    expect((await detail.json()).space.name).toBe('Nuevo nombre')
  })
  await test.step('6. El usuario B intenta eliminar el espacio ajeno y no lo encuentra', async () => {
    expect((await send(b, 'delete', `spaces/${id}`)).status()).toBe(404)
  })
  await test.step('7. El usuario A elimina el espacio', async () => {
    expect((await send(a, 'delete', `spaces/${id}`)).status()).toBe(204)
  })
  await test.step('8. El usuario A comprueba que el espacio ya no existe', async () => {
    expect((await a.api.get(`spaces/${id}`)).status()).toBe(404)
  })
})
