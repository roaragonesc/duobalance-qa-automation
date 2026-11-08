import { test, expect } from '../../src/fixtures/api'
import testData from '../../src/data/testData/api/TC49_api_rechazarEntradasYOrigenInvalidos.json' with { type: 'json' }
import { defineCaseData } from '../../src/utils/caseData'

const data = defineCaseData(testData)
test.use({ caseData: data.setup })

// Requiere API real: necesita un backend REST de testing aislado y no se puede probar en modo mock (demo de GitHub Pages).

test('TC49_api_rechazarEntradasYOrigenInvalidos', async ({ request }) => {
  await test.step('1. El cliente registra una cuenta con datos inválidos y es rechazado', async () => {
    const invalid = await request.post('auth/register', {
      data: {
        name: data.inputs.name,
        email: data.inputs.email,
        password: data.inputs.password,
        confirmed: data.inputs.confirmed,
      },
    })
    expect(invalid.status()).toBe(data.expected.httpStatus)
    expect((await invalid.json()).error.code).toBe(data.expected.toBe)
  })
  await test.step('2. El cliente inicia sesión desde un origen no permitido y es rechazado', async () => {
    const origin = await request.post('auth/login', {
      headers: { Origin: data.inputs.Origin },
      data: { email: data.inputs.email1, password: data.inputs.password2 },
    })
    expect(origin.status()).toBe(data.expected.httpStatus3)
  })
})
