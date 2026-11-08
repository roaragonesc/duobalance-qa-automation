import { readdir, readFile } from 'node:fs/promises'
import { test, expect } from '../../src/fixtures/endpointApi'

// Requiere API real: necesita un backend REST de testing aislado y no se puede probar en modo mock (demo de GitHub Pages).
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC02_api_consultarOpenApi', async ({ request }) => {
  let operations: string[] = []
  let covered: string[] = []
  await test.step('1. El cliente consulta la documentación OpenAPI y comprueba su versión', async () => {
    const response = await request.get('api-docs')
    expect(response.status()).toBe(200)
    const document: { openapi: string; paths: Record<string, Record<string, object>> } = await response.json()
    expect(document.openapi).toBe('3.1.0')
    operations = Object.entries(document.paths).flatMap(([path, methods]) =>
      Object.keys(methods).map((method) => `${method.toUpperCase()} ${path}`),
    )
  })
  await test.step('2. El cliente recopila las operaciones cubiertas por los tests de endpoints', async () => {
    const directory = new URL('./', import.meta.url)
    const files = (await readdir(directory)).filter((name) => name.endsWith('.spec.ts'))
    const sources = await Promise.all(files.map((name) => readFile(new URL(name, directory), 'utf8')))
    const endpointSources = sources.filter((source) => {
      const id = /^test\('TC(\d+)_API_/m.exec(source)
      return id !== null && Number(id[1]) <= 45
    })
    covered = endpointSources.flatMap((source) =>
      [...source.matchAll(/test\.step\('TC\d+_((?:get|post|patch|delete)[A-Z][A-Za-z0-9]*)'/g)].map((match) =>
        match[1].toLowerCase(),
      ),
    )
  })
  await test.step('3. El cliente comprueba que cada operación documentada tiene cobertura', async () => {
    const operationNames = operations.map((operation) => operation.replace(/[^A-Za-z0-9]/g, '').toLowerCase())
    expect(covered).toHaveLength(45)
    expect(new Set(covered).size).toBe(45)
    expect(covered.sort()).toEqual(operationNames.sort())
  })
})
