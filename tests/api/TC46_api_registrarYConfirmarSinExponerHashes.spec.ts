import { test, expect } from '../../src/fixtures/api'

test('TC46_api_registrarYConfirmarSinExponerHashes', async ({ request, account, mailToken }) => {
  const registration = await request.post('auth/register', { data: account })
  expect(registration.status()).toBe(202)
  const confirmationToken = await mailToken('Confirma tu cuenta de DuoBalance')
  const confirmation = await request.post('auth/confirm-email', { data: { token: confirmationToken } })
  expect(confirmation.status()).toBe(204)
  const reused = await request.post('auth/confirm-email', { data: { token: confirmationToken } })
  expect(reused.status()).toBe(400)
})
