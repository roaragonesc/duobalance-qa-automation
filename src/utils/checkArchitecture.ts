import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { basename, dirname, join, relative, resolve } from 'node:path'
import ts from 'typescript'
import { defineCaseData } from './caseData'

const repoRoot = join(import.meta.dirname, '..', '..')
const tests = join(repoRoot, 'tests')
const src = join(repoRoot, 'src')
const violations: string[] = []
const expectedJsonFiles = new Set<string>()
let consumedJsonFiles = 0

function visit(node: ts.Node, callback: (node: ts.Node) => void) {
  callback(node)
  ts.forEachChild(node, (child) => visit(child, callback))
}

function callName(node: ts.CallExpression, source: ts.SourceFile) {
  return node.expression.getText(source)
}

function calls(source: ts.SourceFile, name: string): ts.CallExpression[] {
  const result: ts.CallExpression[] = []
  visit(source, (node) => {
    if (ts.isCallExpression(node) && callName(node, source) === name) result.push(node)
  })
  return result
}

function checkCaseJson(path: string, source: ts.SourceFile, suite: string, title: string) {
  const jsonPath = resolve(src, 'data', 'testData', suite, `${title}.json`)
  expectedJsonFiles.add(jsonPath)
  if (!existsSync(jsonPath)) {
    report(path, `falta su JSON: src/data/testData/${suite}/${title}.json`)
    return
  }
  let json: unknown
  try {
    json = JSON.parse(readFileSync(jsonPath, 'utf8'))
    if (typeof json !== 'object' || json === null || Array.isArray(json)) throw new Error('el JSON debe ser un objeto')
    for (const section of ['setup', 'inputs', 'expected']) {
      if (
        !(section in json) ||
        typeof Reflect.get(json, section) !== 'object' ||
        Reflect.get(json, section) === null ||
        Array.isArray(Reflect.get(json, section))
      )
        throw new Error(`falta el objeto ${section}`)
    }
    defineCaseData(json)
  } catch (error) {
    report(jsonPath, `datos invalidos: ${error instanceof Error ? error.message : String(error)}`)
    return
  }
  const jsonImports = source.statements.filter(
    (node): node is ts.ImportDeclaration =>
      ts.isImportDeclaration(node) &&
      ts.isStringLiteral(node.moduleSpecifier) &&
      node.moduleSpecifier.text.endsWith('.json'),
  )
  const ownImport = jsonImports.find(
    (node) =>
      ts.isStringLiteral(node.moduleSpecifier) && resolve(dirname(path), node.moduleSpecifier.text) === jsonPath,
  )
  if (!ownImport?.importClause?.name || ownImport.importClause.isTypeOnly) {
    report(path, 'debe importar por defecto y consumir su propio JSON (basename = titulo/spec)')
    return
  }
  for (const other of jsonImports) {
    if (other !== ownImport) report(path, 'no importa JSON de otro caso: cada spec tiene una unica fuente propia')
  }
  const bindings = new Set([ownImport.importClause.name.text])
  function derived(node: ts.Node): boolean {
    if (ts.isIdentifier(node)) return bindings.has(node.text)
    if (ts.isPropertyAccessExpression(node)) return derived(node.expression)
    if (ts.isCallExpression(node) && callName(node, source) === 'defineCaseData') return node.arguments.some(derived)
    return false
  }
  // Follow module aliases, not just an import-name occurrence in a comment or type.
  for (const statement of source.statements) {
    if (!ts.isVariableStatement(statement)) continue
    for (const declaration of statement.declarationList.declarations) {
      if (ts.isIdentifier(declaration.name) && declaration.initializer && derived(declaration.initializer))
        bindings.add(declaration.name.text)
    }
  }
  let businessUse = false
  let setupUse = false
  for (const testCall of calls(source, 'test')) {
    const body = testCall.arguments[1]
    if (!body) continue
    visit(body, (node) => {
      if (ts.isPropertyAccessExpression(node) && derived(node)) businessUse = true
    })
  }
  for (const useCall of calls(source, 'test.use')) {
    const options = useCall.arguments[0]
    if (!options || !ts.isObjectLiteralExpression(options)) continue
    setupUse ||= options.properties.some(
      (property) =>
        ts.isPropertyAssignment(property) &&
        property.name.getText(source) === 'caseData' &&
        ts.isPropertyAccessExpression(property.initializer) &&
        property.initializer.name.text === 'setup' &&
        derived(property.initializer),
    )
  }
  if (!businessUse) report(path, 'el JSON es decorativo: no se leen sus datos en el cuerpo del test')
  if (!setupUse) report(path, 'debe pasar data.setup a la option caseData para preparar desde el mismo JSON')
  if (businessUse && setupUse) consumedJsonFiles++
}

function checkBusinessLiterals(path: string, source: ts.SourceFile) {
  function scan(node: ts.Node) {
    if (ts.isImportDeclaration(node) || ts.isTypeNode(node)) return
    if (ts.isCallExpression(node) && ['test', 'test.step', 'test.skip'].includes(callName(node, source))) {
      if (callName(node, source) !== 'test.skip') node.arguments.slice(1).forEach(scan)
      return
    }
    if (
      ts.isRegularExpressionLiteral(node) &&
      ts.isCallExpression(node.parent) &&
      /(?:\.toMatch|\.stringMatching)$/.test(callName(node.parent, source))
    ) {
      report(path, 'patron esperado literal: guardalo en expected del JSON y usa new RegExp')
      return
    }
    const literal =
      ts.isStringLiteral(node) ||
      ts.isNumericLiteral(node) ||
      node.kind === ts.SyntaxKind.TrueKeyword ||
      node.kind === ts.SyntaxKind.FalseKeyword ||
      node.kind === ts.SyntaxKind.NullKeyword
    if (literal) {
      const parent = node.parent
      if (
        (ts.isPropertyAssignment(parent) && parent.name === node) ||
        (ts.isElementAccessExpression(parent) && parent.argumentExpression === node)
      )
        return // protocol/object keys and runtime collection indexing
      if (node.kind === ts.SyntaxKind.NullKeyword && ts.isBinaryExpression(parent)) return // runtime parser result
      let owner: ts.CallExpression | undefined
      for (let ancestor = parent; ancestor; ancestor = ancestor.parent) {
        if (ts.isCallExpression(ancestor)) {
          owner = ancestor
          break
        }
        if (ts.isStatement(ancestor)) break
      }
      const name = owner ? callName(owner, source) : ''
      const index = owner?.arguments.indexOf(node as ts.Expression)
      if (ts.isStringLiteral(node)) {
        if (/^(?:\.\/|\.{2}\/|\/)/.test(node.text)) return // framework routes/module paths, not environment URLs
        if (name === 'send' && (index === 1 || index === 2)) return
        if (/\.(get|post|patch|delete)$/.test(name) && index === 0) return
        if (/\.(press|toHaveAttribute|toHaveProperty)$/.test(name) && index === 0) return
        if (node.text === '' && (ts.isVariableDeclaration(parent) || /\.(replace|replaceAll)$/.test(name))) return
        if (node.text === '.spec.ts' && name.endsWith('.endsWith')) return
        if (node.text === 'utf8' && name === 'readFile') return
        if (node.text === '+passwordHash' && name.endsWith('.select')) return
        if (
          node.text === 'test' &&
          ts.isBinaryExpression(parent) &&
          parent.left.getText(source) === 'process.env.NODE_ENV'
        )
          return
      }
      if (ts.isNumericLiteral(node) && name.endsWith('.slice')) return // ISO runtime date slicing
      if (
        (node.kind === ts.SyntaxKind.TrueKeyword || node.kind === ts.SyntaxKind.FalseKeyword) &&
        ts.isPropertyAssignment(parent) &&
        ['$exists', 'nameOnly'].includes(parent.name.getText(source))
      )
        return // Mongo protocol options
      report(path, `dato literal ${node.getText(source)}: mueve entradas/expected de negocio a su JSON`)
      return
    }
    ts.forEachChild(node, scan)
  }
  scan(source)
}

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

for (const suite of ['web', 'api'] as const) {
  const numbers: number[] = []
  for (const path of files(join(tests, suite), '.spec.ts')) {
    const source = readFileSync(path, 'utf8')
    const ast = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true)
    const testCalls = calls(ast, 'test')
    const testCount = testCalls.length
    if (testCount !== 1) report(path, `debe contener exactamente un test (tiene ${testCount})`)

    const titleNode = testCalls[0]?.arguments[0]
    const title = titleNode && ts.isStringLiteral(titleNode) ? titleNode.text : ''
    if (!new RegExp(`^TC\\d+_${suite}_[a-z]`).test(title))
      report(path, `el titulo "${title}" debe seguir TC<n>_${suite}_<nombre>`)
    if (basename(path) !== `${title}.spec.ts`)
      report(path, `el archivo debe llamarse igual que el titulo: ${title}.spec.ts`)
    numbers.push(Number(title.match(/^TC(\d+)_/)?.[1]))
    checkCaseJson(path, ast, suite, title)
    checkBusinessLiterals(path, ast)

    const stepCallNodes = calls(ast, 'test.step')
    const stepNumbers = stepCallNodes.flatMap((node) => {
      const argument = node.arguments[0]
      const match = argument && ts.isStringLiteral(argument) ? /^(\d+)\. .+/.exec(argument.text) : null
      return match ? [Number(match[1])] : []
    })
    const stepCalls = stepCallNodes.length
    if (stepNumbers.length === 0 || stepNumbers.length !== stepCalls) {
      report(path, "cada paso debe llamarse test.step('N. Sujeto + accion', ...) y el test debe tener al menos uno")
    } else if (stepNumbers.some((value, index) => value !== index + 1)) {
      report(path, 'los pasos deben numerarse de forma consecutiva desde 1')
    }

    if (/\btest\.skip\(/.test(source) && !/^\/\/ Requiere API real[^\n]*\ntest\.skip\(true, '[^']+'\)$/m.test(source)) {
      report(
        path,
        'test.skip solo se permite para bloqueos de capacidad: comentario "// Requiere API real: ..." seguido de test.skip(true, \'motivo\')',
      )
    }
    if (suite === 'web' && /\.(getBy\w+|locator)\(|\.goto\(/.test(source)) {
      report(path, 'los specs web no contienen locators ni navegacion: usa Page Objects')
    }
    if (suite === 'web')
      visit(ast, (node) => {
        if (
          ts.isForStatement(node) ||
          ts.isForInStatement(node) ||
          ts.isForOfStatement(node) ||
          ts.isWhileStatement(node) ||
          ts.isDoStatement(node) ||
          ts.isIfStatement(node) ||
          ts.isSwitchStatement(node) ||
          ts.isTryStatement(node) ||
          ts.isConditionalExpression(node) ||
          (ts.isCallExpression(node) && /^(?:Promise\.all)$|\.(?:forEach|map)$/.test(callName(node, ast)))
        )
          report(path, 'los specs web no llevan logica (bucles, if, try, ternarios, Promise.all): una accion por paso')
      })
    if (suite === 'api' && /src\/(pages|components)\//.test(source)) {
      report(path, 'los specs API no importan Pages ni componentes UI')
    }
    if (suite === 'web' && /fixtures\/(api|endpointApi|financeApi)'/.test(source)) {
      report(path, 'los specs web no importan fixtures de la suite API')
    }
  }
  numbers
    .sort((a, b) => a - b)
    .forEach((value, index) => {
      if (value !== index + 1) {
        violations.push(
          `tests/${suite}: la numeracion debe ir de TC01 sin huecos ni repetidos (esperado TC${String(index + 1).padStart(2, '0')}, encontrado TC${value})`,
        )
      }
    })
}
for (const path of files(join(src, 'pages'), '.ts')) {
  if (/\.\.\/fixtures\//.test(readFileSync(path, 'utf8'))) report(path, 'las Pages no dependen de fixtures')
}

const inventory = readFileSync(join(repoRoot, 'docs', 'COMPONENT_INVENTORY.md'), 'utf8')
for (const path of files(src, '.ts')) {
  if (!inventory.includes(`\`${basename(path)}\``)) {
    report(path, 'no aparece en docs/COMPONENT_INVENTORY.md: actualiza el inventario')
  }
}
for (const path of files(join(src, 'data'), '')) {
  if (
    !inventory.includes(`\`${basename(path)}\``) &&
    !inventory.includes(`\`${relative(repoRoot, path).replaceAll('\\', '/')}\``)
  ) {
    report(path, 'archivo de datos no inventariado (incluidos JSON): actualiza docs/COMPONENT_INVENTORY.md')
  }
}
for (const path of files(join(src, 'data', 'testData'), '.json')) {
  if (!expectedJsonFiles.has(resolve(path))) report(path, 'JSON huerfano: no tiene spec con el mismo basename y suite')
}

if (violations.length > 0) {
  console.error(`Reglas de arquitectura incumplidas (${violations.length}):\n${violations.join('\n')}`)
  process.exit(1)
}
console.log(
  `Arquitectura del framework: sin incumplimientos. ${consumedJsonFiles} JSON propios consumidos; numeracion web/API consecutiva.`,
)
