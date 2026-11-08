import { test, expect } from '../../src/fixtures/api'

// Requiere API real: necesita un backend REST de testing aislado y no se puede probar en modo mock (demo de GitHub Pages).
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC50_api_recuperarClaveYRevocarSesiones', async ({ request, playwright, baseURL, account, mailToken }) => {
  const otherSession = await playwright.request.newContext({
    baseURL,
    extraHTTPHeaders: { Origin: 'http://localhost:5173' },
  })
  let value = ''
  try {
    await test.step('1. El cliente registra una cuenta nueva', async () => {
      const registration = await request.post('auth/register', { data: account })
      expect(registration.status()).toBe(202)
    })
    await test.step('2. El cliente confirma el correo con el token recibido', async () => {
      const confirmation = await request.post('auth/confirm-email', {
        data: { token: await mailToken('Confirma tu cuenta de DuoBalance') },
      })
      expect(confirmation.status()).toBe(204)
    })
    await test.step('3. El cliente inicia sesión en su sesión principal', async () => {
      const login = await request.post('auth/login', { data: { email: account.email, password: account.password } })
      expect(login.status()).toBe(200)
    })
    await test.step('4. El cliente inicia sesión también en una segunda sesión', async () => {
      const otherLogin = await otherSession.post('auth/login', {
        data: { email: account.email, password: account.password },
      })
      expect(otherLogin.status()).toBe(200)
    })
    await test.step('5. El cliente solicita la recuperación de la contraseña', async () => {
      const forgot = await request.post('auth/forgot-password', { data: { email: account.email } })
      expect(forgot.status()).toBe(202)
    })
    await test.step('6. El cliente obtiene el token del correo de recuperación', async () => {
      value = await mailToken('Recupera tu contraseña de DuoBalance')
    })
    await test.step('7. El cliente restablece la contraseña con el token', async () => {
      const reset = await request.post('auth/reset-password', { data: { token: value, password: 'NuevaClave123!' } })
      expect(reset.status()).toBe(204)
    })
    await test.step('8. El cliente comprueba que la segunda sesión ha sido revocada', async () => {
      const revoked = await otherSession.get('auth/me')
      expect(revoked.status()).toBe(401)
    })
    await test.step('9. El cliente intenta reutilizar el token de recuperación y es rechazado', async () => {
      const reused = await request.post('auth/reset-password', { data: { token: value, password: 'OtraClave123!' } })
      expect(reused.status()).toBe(400)
    })
    await test.step('10. El cliente comprueba que la contraseña anterior ya no es válida', async () => {
      const oldPassword = await request.post('auth/login', {
        data: { email: account.email, password: account.password },
      })
      expect(oldPassword.status()).toBe(401)
    })
    await test.step('11. El cliente inicia sesión con la contraseña nueva', async () => {
      const newPassword = await request.post('auth/login', {
        data: { email: account.email, password: 'NuevaClave123!' },
      })
      expect(newPassword.status()).toBe(200)
    })
  } finally {
    await otherSession.dispose()
  }
})
