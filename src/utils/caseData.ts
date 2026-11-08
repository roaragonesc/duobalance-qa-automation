import type { AppSection } from '../components/AppNavigation'
import type { DemoUserKey } from '../data/demoUsers'
import type { ExpenseTypeFilter } from '../pages/ExpensesPage'
import type { SplitChoice } from '../pages/OnboardingPage'

export type UserData = { name: string; email: string; password: string }
export type ExpenseData = { description: string; amount: string; individual?: boolean; category: string }
export type WebSetup = {
  journeyUsers?: { a?: UserData; b?: UserData }
  demoUsers?: Partial<Record<DemoUserKey, UserData>>
  e2eExpenses?: { supermarket?: ExpenseData; hairdresser?: ExpenseData; fuel?: ExpenseData }
  demoExpenses?: {
    shared?: ExpenseData
    private?: ExpenseData
    partnerShared?: ExpenseData
    partnerPrivate?: ExpenseData
  }
  space?: { name: string; splitMethod: SplitChoice }
  demoUser?: DemoUserKey
}
export type ApiSetup = {
  httpStatuses?: {
    registered?: number
    confirmed?: number
    authenticated?: number
    created?: number
    accepted?: number
  }
  account?: UserData
  actors?: { a: UserData; b: UserData; outsider: UserData }
  household?: {
    name: string
    splitMethod: SplitChoice
    category: { name: string; icon: string; color: string }
  }
  invitationSpace?: { name: string; splitMethod: SplitChoice }
  expense?: { description: string; amountCents: number; kind: 'shared' | 'individual' }
  income?: { description: string; amountCents: number }
  settlement?: { amountCents: number; note: string }
  confirmationSubject?: string
}

type EnumFields = {
  splitMethod: SplitChoice
  demoUser: DemoUserKey
  expenseType: ExpenseTypeFilter
  section: AppSection
  kind: 'shared' | 'individual'
}
type Validated<T> = T extends readonly (infer Item)[]
  ? Validated<Item>[]
  : T extends object
    ? { [Key in keyof T]: Key extends keyof EnumFields ? EnumFields[Key] : Validated<T[Key]> }
    : T

const enumFields: { [Key in keyof EnumFields]: readonly EnumFields[Key][] } = {
  splitMethod: ['equal', 'proportional'],
  demoUser: ['rocio', 'pablo', 'ines', 'mateo', 'nuevo', 'solo'],
  expenseType: ['all', 'shared', 'individual'],
  section: ['Inicio', 'Gastos', 'Ingresos', 'Balance', 'Espacio', 'Mi perfil'],
  kind: ['shared', 'individual'],
}

/** JSON imports retain their inferred shape; only verified enum fields are narrowed. */
export function defineCaseData<T extends object>(value: T): Validated<T> {
  function validate(node: unknown, path: string) {
    if (node === null || typeof node !== 'object') return
    for (const [key, child] of Object.entries(node)) {
      if (Object.hasOwn(enumFields, key)) {
        const allowed: readonly string[] = enumFields[key as keyof EnumFields]
        if (typeof child !== 'string' || !allowed.includes(child)) {
          throw new Error(`${path}.${key}: valor JSON fuera del contrato (${allowed.join(', ')})`)
        }
      }
      validate(child, `${path}.${key}`)
    }
  }
  validate(value, 'testData')
  // Every narrowed field has been checked above; no unverified double cast.
  return value as Validated<T>
}

export function requiredData<T>(value: T | undefined, name: string): T {
  if (value === undefined) throw new Error(`Falta ${name} en el JSON del caso`)
  return value
}
