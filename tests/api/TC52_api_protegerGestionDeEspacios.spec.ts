import { test, expect, send } from '../../src/fixtures/financeApi'
import testData from '../../src/data/testData/api/TC52_api_protegerGestionDeEspacios.json' with { type: 'json' }
import { defineCaseData } from '../../src/utils/caseData'

const data = defineCaseData(testData)
test.use({ caseData: data.setup })

// Requiere API real: necesita un backend REST de testing aislado y no se puede probar en modo mock (demo de GitHub Pages).

test('TC52_api_protegerGestionDeEspacios', async ({ actors }) => {
  const { a, b } = actors
  let id = ''
  await test.step('1. El usuario A crea un espacio nuevo', async () => {
    const created = await send(a, 'post', 'spaces', { name: data.inputs.name, splitMethod: data.inputs.splitMethod })
    expect(created.status()).toBe(data.expected.httpStatus)
    id = (await created.json()).space._id
  })
  await test.step('2. El usuario A intenta crear un segundo espacio y es rechazado', async () => {
    expect(
      (
        await send(a, 'post', 'spaces', { name: data.inputs.nameRequest, splitMethod: data.inputs.splitMethod })
      ).status(),
    ).toBe(data.expected.httpStatus1)
  })
  await test.step('3. El usuario B intenta consultar el espacio ajeno y no lo encuentra', async () => {
    expect((await b.api.get(`spaces/${id}`)).status()).toBe(data.expected.httpStatus2)
  })
  await test.step('4. El usuario A cambia el nombre del espacio', async () => {
    expect((await send(a, 'patch', `spaces/${id}`, { name: data.inputs.name3 })).status()).toBe(
      data.expected.httpStatus4,
    )
  })
  await test.step('5. El usuario A consulta el espacio y comprueba el nombre nuevo', async () => {
    const detail = await a.api.get(`spaces/${id}`)
    expect((await detail.json()).space.name).toBe(data.expected.toBe)
  })
  await test.step('6. El usuario B intenta eliminar el espacio ajeno y no lo encuentra', async () => {
    expect((await send(b, 'delete', `spaces/${id}`)).status()).toBe(data.expected.httpStatus2)
  })
  await test.step('7. El usuario A elimina el espacio', async () => {
    expect((await send(a, 'delete', `spaces/${id}`)).status()).toBe(data.expected.httpStatus5)
  })
  await test.step('8. El usuario A comprueba que el espacio ya no existe', async () => {
    expect((await a.api.get(`spaces/${id}`)).status()).toBe(data.expected.httpStatus2)
  })
})
