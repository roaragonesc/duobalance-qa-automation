import { test, expect, normalizeApiOperation } from '../../src/fixtures/endpointApi'
import testData from '../../src/data/testData/api/TC02_api_consultarOpenApi.json' with { type: 'json' }
import { defineCaseData } from '../../src/utils/caseData'

const data = defineCaseData(testData)
test.use({ caseData: data.setup })

// Requiere API real: necesita un backend REST de testing aislado y no se puede probar en modo mock (demo de GitHub Pages).

test('TC02_api_consultarOpenApi', async ({ request, endpointCoverage }) => {
  let operations: string[] = []
  let covered: string[] = []
  await test.step('1. El cliente consulta la documentación OpenAPI y comprueba su versión', async () => {
    const response = await request.get('api-docs')
    expect(response.status()).toBe(data.expected.httpStatus)
    const document: { openapi: string; paths: Record<string, Record<string, object>> } = await response.json()
    expect(document.openapi).toBe(data.expected.toBe)
    operations = Object.entries(document.paths).flatMap(([path, methods]) =>
      Object.keys(methods).map((method) => `${method.toUpperCase()} ${path}`),
    )
  })
  await test.step('2. El cliente recopila las operaciones cubiertas por los tests de endpoints', async () => {
    covered = await endpointCoverage(data.inputs.value)
  })
  await test.step('3. El cliente comprueba que cada operación documentada tiene cobertura', async () => {
    const operationNames = operations.map(normalizeApiOperation)
    expect(covered).toHaveLength(data.expected.toHaveLength)
    expect(new Set(covered).size).toBe(data.expected.toBe1)
    expect(covered.sort()).toEqual(operationNames.sort())
  })
})
