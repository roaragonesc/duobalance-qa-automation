import { test, expect } from '../../src/fixtures/api'
import testData from '../../src/data/testData/api/TC46_api_registrarYConfirmarSinExponerHashes.json'
import { defineCaseData } from '../../src/utils/caseData'

const data = defineCaseData(testData)
test.use({ caseData: data.setup })

// Requiere API real: necesita un backend REST de testing aislado y no se puede probar en modo mock (demo de GitHub Pages).
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC46_api_registrarYConfirmarSinExponerHashes', async ({ request, account, mailToken }) => {
  let confirmationToken = ''
  await test.step('1. El cliente registra una cuenta nueva', async () => {
    const registration = await request.post('auth/register', { data: account })
    expect(registration.status()).toBe(data.expected.httpStatus)
  })
  await test.step('2. El cliente obtiene el token del correo de confirmación', async () => {
    confirmationToken = await mailToken(data.inputs.mailToken)
  })
  await test.step('3. El cliente confirma el correo con el token', async () => {
    const confirmation = await request.post('auth/confirm-email', { data: { token: confirmationToken } })
    expect(confirmation.status()).toBe(data.expected.httpStatus1)
  })
  await test.step('4. El cliente intenta reutilizar el token y es rechazado', async () => {
    const reused = await request.post('auth/confirm-email', { data: { token: confirmationToken } })
    expect(reused.status()).toBe(data.expected.httpStatus2)
  })
})
