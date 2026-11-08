import { test, expect, send } from '../../src/fixtures/financeApi'
import testData from '../../src/data/testData/api/TC54_api_protegerCategoriasPersonales.json' with { type: 'json' }
import { defineCaseData } from '../../src/utils/caseData'

const data = defineCaseData(testData)
test.use({ caseData: data.setup })

// Requiere API real: necesita un backend REST de testing aislado y no se puede probar en modo mock (demo de GitHub Pages).
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC54_api_protegerCategoriasPersonales', async ({ actors }) => {
  const { a, b } = actors
  const input = { name: data.inputs.name, icon: data.inputs.icon, color: data.inputs.color }
  let id = ''
  await test.step('1. El usuario A crea una categoría personal', async () => {
    const created = await send(a, 'post', 'categories', input)
    expect(created.status()).toBe(data.expected.httpStatus)
    id = (await created.json()).category._id
  })
  await test.step('2. El usuario B intenta modificar la categoría ajena y no la encuentra', async () => {
    expect((await send(b, 'patch', `categories/${id}`, input)).status()).toBe(data.expected.httpStatus1)
  })
  await test.step('3. El usuario A actualiza su categoría', async () => {
    expect((await send(a, 'patch', `categories/${id}`, { ...input, name: data.inputs.nameRequest })).status()).toBe(
      data.expected.httpStatus2,
    )
  })
  await test.step('4. El usuario B lista sus categorías y comprueba que no aparece la ajena', async () => {
    const list = await b.api.get('categories')
    expect((await list.json()).categories.map((item: { _id: string }) => item._id)).not.toContain(id)
  })
  await test.step('5. El usuario A elimina su categoría', async () => {
    expect((await send(a, 'delete', `categories/${id}`)).status()).toBe(data.expected.httpStatus3)
  })
})
