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

const suites = readdirSync(tests, { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => entry.name)
for (const suite of suites) {
  if (suite !== 'web' && suite !== 'api') {
    violations.push(`tests/${suite}: tests/ solo puede contener las carpetas web y api; el codigo del framework va en src/`)
  }
}
for (const entry of readdirSync(tests, { withFileTypes: true })) {
  if (entry.isFile()) violations.push(`tests/${entry.name}: tests/ solo puede contener las carpetas web y api`)
}

const suiteNumbers: Record<string, number[]> = { web: [], api: [] }
for (const suite of ['web', 'api']) {
  for (const path of files(join(tests, suite), '.spec.ts')) {
    const source = readFileSync(path, 'utf8')
    const testCount = source.match(/^test\(/gm)?.length ?? 0
    if (testCount !== 1) report(path, `debe contener exactamente un test (tiene ${testCount})`)
    const title = source.match(/^test\('([^']+)'/m)?.[1] ?? ''
    const expected = suite === 'api' ? /^TC\d+_api_[a-z]/ : /^TC\d+_web_(e2e_)?[a-z]/
    if (!expected.test(title)) {
      report(path, `el titulo "${title}" debe seguir TC<n>_${suite}_<nombre> (TC<n>_web_e2e_<nombre> si es end-to-end con API)`)
    }
    if (basename(path) !== `${title}.spec.ts`) {
      report(path, `el archivo debe llamarse igual que el titulo: ${title}.spec.ts`)
    }
    const number = Number(title.match(/^TC(\d+)_/)?.[1])
    suiteNumbers[suite].push(number)
    if (suite === 'web') {
      const usesRealApi = /fixtures\/apiWeb'/.test(source)
      if (usesRealApi !== /^TC\d+_web_e2e_/.test(title)) {
        report(path, 'los tests web contra la API real (fixtures/apiWeb) llevan _e2e_ en el titulo y los demas no')
      }
    }
    if (/\btest\.skip\(/.test(source) && !/^\/\/ Requiere API real[^\n]*\ntest\.skip\(true, '[^']+'\)$/m.test(source)) {
      report(path, 'test.skip solo se permite para bloqueos de capacidad: comentario "// Requiere API real: ..." seguido de test.skip(true, \'motivo\')')
    }
  }
  const sorted = [...suiteNumbers[suite]].sort((a, b) => a - b)
  sorted.forEach((value, index) => {
    if (value !== index + 1) {
      violations.push(`tests/${suite}: la numeracion debe ir de TC01 sin huecos ni repetidos (esperado TC${String(index + 1).padStart(2, '0')}, encontrado TC${value})`)
    }
  })
}

for (const path of files(join(tests, 'web'), '.spec.ts')) {
  const source = readFileSync(path, 'utf8')
  if (/\.(getBy\w+|locator)\(|\.goto\(/.test(source)) {
    report(path, 'los specs web no contienen locators ni navegacion: usa Page Objects')
  }
  if (/fixtures\/(api|endpointApi|financeApi)'/.test(source)) {
    report(path, 'los specs web no importan fixtures de la suite API')
  }
}

for (const path of files(join(tests, 'api'), '.spec.ts')) {
  if (/src\/(pages|components)\//.test(readFileSync(path, 'utf8'))) {
    report(path, 'los specs API no importan Pages ni componentes UI')
  }
}

for (const path of files(join(src, 'pages'), '.ts')) {
  if (/\.\.\/fixtures\//.test(readFileSync(path, 'utf8'))) {
    report(path, 'las Pages no dependen de fixtures')
  }
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
