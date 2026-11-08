import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'
import { backendRoot } from '../config/localEnvironment'
import { database } from './backendDatabase'

export async function seed(password: string): Promise<unknown> {
  const module = await import(pathToFileURL(resolve(backendRoot, 'src/seeds/seed.ts')).href)
  return module.seed(password)
}

export async function seedUsers() {
  await import(pathToFileURL(resolve(backendRoot, 'src/models/User.ts')).href)
  return database.model<{ email: string; name: string; passwordHash: string }>('User')
}
