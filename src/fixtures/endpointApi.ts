import { readdir, readFile } from 'node:fs/promises'
import ts from 'typescript'
import { test as base, send } from './financeApi'
import { requiredData } from '../utils/caseData'

export const today = () => new Date().toISOString().slice(0, 10)

export const normalizeApiOperation = (operation: string) => operation.replace(/\{[^}]*\}/g, '{}').toLowerCase()

export const test = base.extend<{
  registeredAccount: void
  confirmedAccount: void
  authenticatedAccount: { csrf: string }
  pendingInvitation: { spaceId: string; token: string }
  expense: {
    id: string
    input: { categoryId: string; description: string; amountCents: number; date: string; kind: 'shared' | 'individual' }
  }
  income: { id: string; input: { description: string; amountCents: number; date: string } }
  settlementId: string
  endpointCoverage: (maximumCase: number) => Promise<string[]>
}>({
  endpointCoverage: async ({ request: _request }, provideFixtures) => {
    await provideFixtures(async (maximumCase) => {
      const directory = new URL('../../tests/api/', import.meta.url)
      const files = (await readdir(directory)).filter((name) => {
        const id = /^TC(\d+)_api_.*\.spec\.ts$/.exec(name)
        return id !== null && Number(id[1]) <= maximumCase
      })
      const sources = await Promise.all(files.map((name) => readFile(new URL(name, directory), 'utf8')))
      const operations = new Set<string>()
      for (const source of sources) {
        const parsed = ts.createSourceFile('endpoint.spec.ts', source, ts.ScriptTarget.Latest, true)
        const visit = (node: ts.Node) => {
          if (ts.isCallExpression(node)) {
            let method: string | undefined
            let path: ts.Expression | undefined
            if (ts.isIdentifier(node.expression) && node.expression.text === 'send') {
              const argument = node.arguments[1]
              if (argument && ts.isStringLiteral(argument)) method = argument.text
              path = node.arguments[2]
            } else if (ts.isPropertyAccessExpression(node.expression)) {
              const receiver = node.expression.expression
              if (
                (ts.isIdentifier(receiver) && receiver.text === 'request') ||
                (ts.isPropertyAccessExpression(receiver) && receiver.name.text === 'api')
              ) {
                method = node.expression.name.text
                path = node.arguments[0]
              }
            }
            if (method && /^(get|post|patch|delete)$/.test(method) && path) {
              let route: string | undefined
              if (ts.isStringLiteral(path) || ts.isNoSubstitutionTemplateLiteral(path)) route = path.text
              else if (ts.isTemplateExpression(path))
                route = path.head.text + path.templateSpans.map((span) => `{}` + span.literal.text).join('')
              if (route !== undefined) operations.add(normalizeApiOperation(`${method} /${route.replace(/^\/+/, '')}`))
            }
          }
          ts.forEachChild(node, visit)
        }
        visit(parsed)
      }
      return [...operations]
    })
  },
  registeredAccount: async ({ request, account, caseData }, provideFixtures) => {
    const response = await request.post('auth/register', { data: account })
    if (response.status() !== requiredData(caseData.httpStatuses?.registered, 'setup.httpStatuses.registered'))
      throw new Error(`Preparación registro: HTTP ${response.status()}`)
    await provideFixtures()
  },
  confirmedAccount: async ({ request, registeredAccount: _registered, mailToken, caseData }, provideFixtures) => {
    const response = await request.post('auth/confirm-email', {
      data: { token: await mailToken(requiredData(caseData.confirmationSubject, 'setup.confirmationSubject')) },
    })
    if (response.status() !== requiredData(caseData.httpStatuses?.confirmed, 'setup.httpStatuses.confirmed'))
      throw new Error(`Preparación confirmación: HTTP ${response.status()}`)
    await provideFixtures()
  },
  authenticatedAccount: async ({ request, account, confirmedAccount: _confirmed, caseData }, provideFixtures) => {
    const response = await request.post('auth/login', { data: { email: account.email, password: account.password } })
    if (response.status() !== requiredData(caseData.httpStatuses?.authenticated, 'setup.httpStatuses.authenticated'))
      throw new Error(`Preparación login: HTTP ${response.status()}`)
    await provideFixtures({ csrf: (await response.json()).csrfToken })
  },
  pendingInvitation: async ({ actors, caseData }, provideFixtures) => {
    const space = await send(
      actors.a,
      'post',
      'spaces',
      requiredData(caseData.invitationSpace, 'setup.invitationSpace'),
    )
    const createdStatus = requiredData(caseData.httpStatuses?.created, 'setup.httpStatuses.created')
    if (space.status() !== createdStatus) throw new Error(`Preparación espacio: HTTP ${space.status()}`)
    const spaceId = (await space.json()).space._id
    const invitation = await send(actors.a, 'post', `spaces/${spaceId}/invitations`, { email: actors.b.email })
    if (invitation.status() !== createdStatus) throw new Error(`Preparación invitación: HTTP ${invitation.status()}`)
    await provideFixtures({ spaceId, token: (await invitation.json()).token })
  },
  expense: async ({ household, caseData }, provideFixtures) => {
    const input = {
      ...requiredData(caseData.expense, 'setup.expense'),
      categoryId: household.categoryId,
      date: today(),
    }
    const response = await send(household.a, 'post', 'expenses', { ...input, spaceId: household.spaceId })
    if (response.status() !== requiredData(caseData.httpStatuses?.created, 'setup.httpStatuses.created'))
      throw new Error(`Preparación gasto: HTTP ${response.status()}`)
    await provideFixtures({ id: (await response.json()).expense._id, input })
  },
  income: async ({ household, caseData }, provideFixtures) => {
    const input = { ...requiredData(caseData.income, 'setup.income'), date: today() }
    const response = await send(household.a, 'post', 'incomes', { ...input, spaceId: household.spaceId })
    if (response.status() !== requiredData(caseData.httpStatuses?.created, 'setup.httpStatuses.created'))
      throw new Error(`Preparación ingreso: HTTP ${response.status()}`)
    await provideFixtures({ id: (await response.json()).income._id, input })
  },
  settlementId: async ({ household, expense: _expense, caseData }, provideFixtures) => {
    const response = await send(household.a, 'post', `spaces/${household.spaceId}/settlements`, {
      date: today(),
      ...requiredData(caseData.settlement, 'setup.settlement'),
    })
    if (response.status() !== requiredData(caseData.httpStatuses?.created, 'setup.httpStatuses.created'))
      throw new Error(`Preparación liquidación: HTTP ${response.status()}`)
    await provideFixtures((await response.json()).settlement._id)
  },
})

export { expect, send } from './financeApi'
