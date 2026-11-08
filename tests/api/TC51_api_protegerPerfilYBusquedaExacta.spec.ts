import { test, expect } from '../../src/fixtures/api'

// Requiere API real: necesita un backend REST de testing aislado y no se puede probar en modo mock (demo de GitHub Pages).
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC51_api_protegerPerfilYBusquedaExacta', async ({ request, account, mailToken }) => {
  let csrfToken = ''
  await test.step('1. El cliente registra una cuenta nueva', async () => {
    const registration = await request.post('auth/register', { data: account })
    expect(registration.status()).toBe(202)
  })
  await test.step('2. El cliente confirma el correo con el token recibido', async () => {
    const confirmed = await request.post('auth/confirm-email', {
      data: { token: await mailToken('Confirma tu cuenta de DuoBalance') },
    })
    expect(confirmed.status()).toBe(204)
  })
  await test.step('3. El cliente inicia sesión y guarda su token CSRF', async () => {
    const login = await request.post('auth/login', { data: { email: account.email, password: account.password } })
    expect(login.status()).toBe(200)
    csrfToken = (await login.json()).csrfToken
  })
  await test.step('4. El cliente actualiza su nombre de perfil', async () => {
    const update = await request.patch('users/me', {
      data: { name: 'Nombre actualizado' },
      headers: { 'X-CSRF-Token': csrfToken },
    })
    expect(update.status()).toBe(200)
    expect((await update.json()).user.name).toBe('Nombre actualizado')
  })
  await test.step('5. El cliente consulta su perfil y comprueba el nombre actualizado', async () => {
    const me = await request.get('users/me')
    expect(me.status()).toBe(200)
    expect((await me.json()).user.name).toBe('Nombre actualizado')
  })
  await test.step('6. El cliente busca su usuario por el correo exacto', async () => {
    const lookup = await request.get('users', { params: { email: account.email } })
    expect(lookup.status()).toBe(200)
    expect((await lookup.json()).users).toEqual([
      expect.objectContaining({ email: account.email, name: 'Nombre actualizado' }),
    ])
  })
  await test.step('7. El cliente intenta listar usuarios sin indicar correo y es rechazado', async () => {
    const directory = await request.get('users')
    expect(directory.status()).toBe(400)
  })
  await test.step('8. El cliente intenta modificar campos protegidos de su perfil y es rechazado', async () => {
    const massAssignment = await request.patch('users/me', {
      data: { name: 'Otro', email: 'ajeno@duobalance.test', confirmed: true },
      headers: { 'X-CSRF-Token': csrfToken },
    })
    expect(massAssignment.status()).toBe(400)
  })
})
