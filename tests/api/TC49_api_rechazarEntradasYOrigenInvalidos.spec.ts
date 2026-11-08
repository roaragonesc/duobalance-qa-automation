import { test, expect } from '../../src/fixtures/api'

// Requiere API real: necesita un backend REST de testing aislado y no se puede probar en modo mock (demo de GitHub Pages).
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC49_api_rechazarEntradasYOrigenInvalidos', async ({ request }) => {
  await test.step('1. El cliente registra una cuenta con datos inválidos y es rechazado', async () => {
    const invalid = await request.post('auth/register', {
      data: {
        name: '',
        email: 'incorrecto',
        password: 'corta',
        confirmed: true,
      },
    })
    expect(invalid.status()).toBe(400)
    expect((await invalid.json()).error.code).toBe('invalid_input')
  })
  await test.step('2. El cliente inicia sesión desde un origen no permitido y es rechazado', async () => {
    const origin = await request.post('auth/login', {
      headers: { Origin: 'http://otro-origen.test' },
      data: { email: 'cuenta@duobalance.test', password: 'Pruebas1234!' },
    })
    expect(origin.status()).toBe(403)
  })
})
