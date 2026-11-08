import { test, expect } from '../../src/fixtures/endpointApi'
import testData from '../../src/data/testData/api/TC05_api_confirmarCorreo.json' with { type: 'json' }
import { defineCaseData } from '../../src/utils/caseData'

const data = defineCaseData(testData)
test.use({ caseData: data.setup })

// Requiere API real: necesita un backend REST de testing aislado y no se puede probar en modo mock (demo de GitHub Pages).

test('TC05_api_confirmarCorreo', async ({ request, registeredAccount: _registered, mailToken }) => {
  let token = ''
  await test.step('1. El cliente obtiene el token del correo de confirmación', async () => {
    token = await mailToken(data.inputs.mailToken)
  })
  await test.step('2. El cliente confirma el correo con el token', async () => {
    expect((await request.post('auth/confirm-email', { data: { token } })).status()).toBe(data.expected.httpStatus)
  })
  await test.step('3. El cliente intenta reutilizar el mismo token y es rechazado', async () => {
    expect((await request.post('auth/confirm-email', { data: { token } })).status()).toBe(data.expected.httpStatus1)
  })
})
