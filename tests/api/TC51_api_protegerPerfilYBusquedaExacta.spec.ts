import { test, expect } from '../../src/fixtures/api'
import testData from '../../src/data/testData/api/TC51_api_protegerPerfilYBusquedaExacta.json'
import { defineCaseData } from '../../src/utils/caseData'

const data = defineCaseData(testData)
test.use({ caseData: data.setup })

// Requiere API real: necesita un backend REST de testing aislado y no se puede probar en modo mock (demo de GitHub Pages).
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC51_api_protegerPerfilYBusquedaExacta', async ({ request, account, mailToken }) => {
  let csrfToken = ''
  await test.step('1. El cliente registra una cuenta nueva', async () => {
    const registration = await request.post('auth/register', { data: account })
    expect(registration.status()).toBe(data.expected.httpStatus)
  })
  await test.step('2. El cliente confirma el correo con el token recibido', async () => {
    const confirmed = await request.post('auth/confirm-email', {
      data: { token: await mailToken(data.inputs.mailToken) },
    })
    expect(confirmed.status()).toBe(data.expected.httpStatus1)
  })
  await test.step('3. El cliente inicia sesión y guarda su token CSRF', async () => {
    const login = await request.post('auth/login', { data: { email: account.email, password: account.password } })
    expect(login.status()).toBe(data.expected.httpStatus2)
    csrfToken = (await login.json()).csrfToken
  })
  await test.step('4. El cliente actualiza su nombre de perfil', async () => {
    const update = await request.patch('users/me', {
      data: { name: data.inputs.name },
      headers: { 'X-CSRF-Token': csrfToken },
    })
    expect(update.status()).toBe(data.expected.httpStatus2)
    expect((await update.json()).user.name).toBe(data.expected.toBe)
  })
  await test.step('5. El cliente consulta su perfil y comprueba el nombre actualizado', async () => {
    const me = await request.get('users/me')
    expect(me.status()).toBe(data.expected.httpStatus2)
    expect((await me.json()).user.name).toBe(data.expected.toBe)
  })
  await test.step('6. El cliente busca su usuario por el correo exacto', async () => {
    const lookup = await request.get('users', { params: { email: account.email } })
    expect(lookup.status()).toBe(data.expected.httpStatus2)
    expect((await lookup.json()).users).toEqual([
      expect.objectContaining({ email: account.email, name: data.expected.name }),
    ])
  })
  await test.step('7. El cliente intenta listar usuarios sin indicar correo y es rechazado', async () => {
    const directory = await request.get('users')
    expect(directory.status()).toBe(data.expected.httpStatus3)
  })
  await test.step('8. El cliente intenta modificar campos protegidos de su perfil y es rechazado', async () => {
    const massAssignment = await request.patch('users/me', {
      data: { name: data.inputs.name4, email: data.inputs.email, confirmed: data.inputs.confirmed },
      headers: { 'X-CSRF-Token': csrfToken },
    })
    expect(massAssignment.status()).toBe(data.expected.httpStatus3)
  })
})
