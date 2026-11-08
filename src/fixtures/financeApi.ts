import { randomUUID } from 'node:crypto'
import { readdir, readFile, unlink } from 'node:fs/promises'
import { resolve } from 'node:path'
import type { APIRequestContext, APIResponse } from '@playwright/test'
import { test as base, expect } from './api'
import { mailDirectory } from '../config/localEnvironment'
import { requiredData, type UserData } from '../utils/caseData'

export type Actor = { api: APIRequestContext; csrf: string; id: string; email: string; name: string }
type Fixtures = {
  actors: { a: Actor; b: Actor; outsider: Actor }
  household: { spaceId: string; categoryId: string; a: Actor; b: Actor; outsider: Actor }
}

export async function send(
  actor: Actor,
  method: 'post' | 'patch' | 'delete',
  path: string,
  data?: object,
): Promise<APIResponse> {
  return actor.api[method](path, { data, headers: { 'X-CSRF-Token': actor.csrf } })
}

export const test = base.extend<Fixtures>({
  actors: async ({ playwright, baseURL, caseData }, provideFixtures) => {
    const contexts: APIRequestContext[] = []
    const mailFiles: string[] = []
    async function actor(input: UserData): Promise<Actor> {
      const { name, password } = input
      const email = input.email.replace('@', `-${randomUUID()}@`)
      const api = await playwright.request.newContext({
        baseURL,
        extraHTTPHeaders: { Origin: 'http://localhost:5173' },
      })
      contexts.push(api)
      const registered = await api.post('auth/register', { data: { name, email, password } })
      if (registered.status() !== requiredData(caseData.httpStatuses?.registered, 'setup.httpStatuses.registered'))
        throw new Error(`Preparación registro: HTTP ${registered.status()}`)
      const directory = mailDirectory()
      let token: string | undefined
      for (const filename of await readdir(directory)) {
        const path = resolve(directory, filename)
        const mail = JSON.parse(await readFile(path, 'utf8'))
        if (mail.to === email) {
          mailFiles.push(path)
          token = typeof mail.text === 'string' ? mail.text.match(/[a-f0-9]{64}/)?.[0] : undefined
        }
      }
      if (!token) throw new Error('No se encontró confirmación del usuario aislado.')
      const confirmed = await api.post('auth/confirm-email', { data: { token } })
      if (confirmed.status() !== requiredData(caseData.httpStatuses?.confirmed, 'setup.httpStatuses.confirmed'))
        throw new Error(`Preparación confirmación: HTTP ${confirmed.status()}`)
      const logged = await api.post('auth/login', { data: { email, password } })
      if (logged.status() !== requiredData(caseData.httpStatuses?.authenticated, 'setup.httpStatuses.authenticated'))
        throw new Error(`Preparación login: HTTP ${logged.status()}`)
      const body = await logged.json()
      return { api, csrf: body.csrfToken, id: body.user.id, email, name }
    }
    try {
      const actors = requiredData(caseData.actors, 'setup.actors')
      await provideFixtures({
        a: await actor(actors.a),
        b: await actor(actors.b),
        outsider: await actor(actors.outsider),
      })
    } finally {
      for (const context of contexts) await context.dispose()
      for (const path of mailFiles) await unlink(path)
    }
  },
  household: async ({ actors, caseData }, provideFixtures) => {
    const { a, b } = actors
    const household = requiredData(caseData.household, 'setup.household')
    const created = await send(a, 'post', 'spaces', { name: household.name, splitMethod: household.splitMethod })
    const createdStatus = requiredData(caseData.httpStatuses?.created, 'setup.httpStatuses.created')
    if (created.status() !== createdStatus) throw new Error(`Preparación espacio: HTTP ${created.status()}`)
    const spaceId = (await created.json()).space._id
    const invitation = await send(a, 'post', `spaces/${spaceId}/invitations`, { email: b.email })
    if (invitation.status() !== createdStatus) throw new Error(`Preparación invitación: HTTP ${invitation.status()}`)
    const accepted = await send(b, 'post', `invitations/${(await invitation.json()).token}/accept`, {})
    if (accepted.status() !== requiredData(caseData.httpStatuses?.accepted, 'setup.httpStatuses.accepted'))
      throw new Error(`Preparación aceptación: HTTP ${accepted.status()}`)
    const category = await send(a, 'post', 'categories', household.category)
    if (category.status() !== createdStatus) throw new Error(`Preparación categoría: HTTP ${category.status()}`)
    await provideFixtures({ ...actors, spaceId, categoryId: (await category.json()).category._id })
  },
})

export { expect }
