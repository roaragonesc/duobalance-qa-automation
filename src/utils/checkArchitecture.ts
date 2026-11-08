import { readdirSync, readFileSync } from 'node:fs'
import { basename, join, relative } from 'node:path'

const repoRoot = join(import.meta.dirname, '..', '..')
const tests = join(repoRoot, 'tests')
const src = join(repoRoot, 'src')
const violations: string[] = []

function files(directory: string, suffix: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) return files(path, suffix)
    return path.endsWith(suffix) ? [path] : []
  })
}

function report(path: string, message: string) {
  violations.push(`${relative(repoRoot, path)}: ${message}`)
}

const forbiddenEverywhere = [
  [/\btest\.(only|fixme)\b/, 'test.only/test.fixme no se permiten'],
  [/waitForTimeout\(/, 'waitForTimeout no se permite: espera una condicion'],
  [/networkidle/, 'networkidle no se permite como espera generica'],
  [/force:\s*true/, 'force: true no se permite'],
] as const

for (const path of [...files(src, '.ts'), ...files(tests, '.ts')]) {
  if (path.endsWith('checkArchitecture.ts')) continue
  const source = readFileSync(path, 'utf8')
  for (const [pattern, message] of forbiddenEverywhere) {
    if (pattern.test(source)) report(path, message)
  }
}

for (const entry of readdirSync(tests, { withFileTypes: true })) {
  if (!entry.isDirectory() || !['web', 'api'].includes(entry.name)) {
    violations.push(`tests/${entry.name}: tests/ solo puede contener las carpetas web y api; el codigo va en src/`)
  }
}

const numbers: number[] = []
for (const path of files(join(tests, 'web'), '.spec.ts')) {
  const source = readFileSync(path, 'utf8')
  const testCount = source.match(/^test\(/gm)?.length ?? 0
  if (testCount !== 1) report(path, `debe contener exactamente un test (tiene ${testCount})`)

  const title = source.match(/^test\('([^']+)'/m)?.[1] ?? ''
  if (!/^TC\d+_web_[a-z]/.test(title)) report(path, `el titulo "${title}" debe seguir TC<n>_web_<nombre>`)
  if (basename(path) !== `${title}.spec.ts`)
    report(path, `el archivo debe llamarse igual que el titulo: ${title}.spec.ts`)
  numbers.push(Number(title.match(/^TC(\d+)_/)?.[1]))

  if (/\btest\.skip\(/.test(source) && !/^\/\/ Requiere API real[^\n]*\ntest\.skip\(true, '[^']+'\)$/m.test(source)) {
    report(
      path,
      'test.skip solo se permite para bloqueos de capacidad: comentario "// Requiere API real: ..." seguido de test.skip(true, \'motivo\')',
    )
  }
  if (/\.(getBy\w+|locator)\(|\.goto\(/.test(source)) {
    report(path, 'los specs web no contienen locators ni navegacion: usa Page Objects')
  }
}
;[...numbers]
  .sort((a, b) => a - b)
  .forEach((value, index) => {
    if (value !== index + 1) {
      violations.push(
        `tests/web: la numeracion debe ir de TC01 sin huecos ni repetidos (esperado TC${String(index + 1).padStart(2, '0')}, encontrado TC${value})`,
      )
    }
  })

for (const path of files(join(src, 'pages'), '.ts')) {
  if (/\.\.\/fixtures\//.test(readFileSync(path, 'utf8'))) report(path, 'las Pages no dependen de fixtures')
}

const inventory = readFileSync(join(repoRoot, 'docs', 'COMPONENT_INVENTORY.md'), 'utf8')
for (const path of files(src, '.ts')) {
  if (!inventory.includes(`\`${basename(path)}\``)) {
    report(path, 'no aparece en docs/COMPONENT_INVENTORY.md: actualiza el inventario')
  }
}

if (violations.length > 0) {
  console.error(`Reglas de arquitectura incumplidas (${violations.length}):\n${violations.join('\n')}`)
  process.exit(1)
}
console.log('Arquitectura del framework: sin incumplimientos.')
