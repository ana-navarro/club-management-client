import type { User } from './user-types'

export const makeUser = (overrides: Partial<User> = {}): User => ({
  id: 'u1',
  name: 'Ana',
  email: 'ana@example.com',
  type: 'CLIENT',
  clubs: [],
  preferences: { theme: null, language: null },
  ...overrides,
})

export const userResponse = (overrides: Partial<User> = {}) =>
  new Response(JSON.stringify(makeUser(overrides)), { status: 200 })
