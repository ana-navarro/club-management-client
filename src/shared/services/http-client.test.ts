import { afterEach, describe, expect, it, jest } from '@jest/globals'
import { z } from 'zod'
import { getToken, readSessionNotice, saveSession } from './auth-token'
import { getJson, HttpError, patchJson, postJson, postWithoutResponse } from './http-client'

const schema = z.object({ ok: z.boolean() })

const mockFetch = (status: number, body: string) => {
  const mock = jest.fn<typeof fetch>(async () => new Response(body || null, { status }))
  globalThis.fetch = mock
  return mock
}

const session = { token: 'jwt', expiresAt: 'a', renewAt: 'b' }

afterEach(() => {
  jest.restoreAllMocks()
})

describe('getJson', () => {
  it('requests under the API base and returns the validated body', async () => {
    const mock = mockFetch(200, '{"ok":true}')
    await expect(getJson('/health', schema)).resolves.toEqual({ ok: true })
    expect(mock).toHaveBeenCalledWith('/api/health', { headers: {} })
  })

  it('sends the token', async () => {
    saveSession(session)
    const mock = mockFetch(200, '{"ok":true}')
    await getJson('/users/me', schema)
    expect(mock).toHaveBeenCalledWith('/api/users/me', { headers: { Authorization: 'Bearer jwt' } })
  })

  it('throws with the status and error code', async () => {
    mockFetch(400, '{"error":"weak_password"}')
    await expect(getJson('/x', schema)).rejects.toBeInstanceOf(HttpError)
    await expect(getJson('/x', schema)).rejects.toMatchObject({ status: 400, code: 'weak_password' })
  })

  it('tolerates an error without a JSON body', async () => {
    mockFetch(500, 'oops')
    await expect(getJson('/x', schema)).rejects.toMatchObject({ status: 500, code: undefined })
  })

  it('refuses a body that does not match the schema', async () => {
    mockFetch(200, '{"ok":"yes"}')
    await expect(getJson('/x', schema)).rejects.toThrow()
  })
})

describe('401 handling', () => {
  it('ends the session and leaves a notice', async () => {
    saveSession(session)
    mockFetch(401, '{"error":"invalid_token"}')
    await expect(getJson('/users/me', schema)).rejects.toBeInstanceOf(HttpError)
    expect(getToken()).toBeNull()
    expect(readSessionNotice()).toBe('expired')
  })

  it('leaves no notice for a failed login, when there was no session', async () => {
    mockFetch(401, '{"error":"invalid_credentials"}')
    await expect(postJson('/auth/login', schema, {})).rejects.toBeInstanceOf(HttpError)
    expect(readSessionNotice()).toBeNull()
  })

  it('keeps the session for other errors', async () => {
    saveSession(session)
    mockFetch(500, '')
    await expect(getJson('/x', schema)).rejects.toBeInstanceOf(HttpError)
    expect(getToken()).toBe('jwt')
  })
})

describe('mutations', () => {
  it('posts JSON', async () => {
    const mock = mockFetch(200, '{"ok":true}')
    await expect(postJson('/x', schema, { a: 1 })).resolves.toEqual({ ok: true })
    expect(mock).toHaveBeenCalledWith('/api/x', {
      method: 'POST',
      body: '{"a":1}',
      headers: { 'Content-Type': 'application/json' },
    })
  })

  it('posts without a body', async () => {
    const mock = mockFetch(200, '{"ok":true}')
    await postJson('/x', schema)
    expect(mock).toHaveBeenCalledWith('/api/x', { method: 'POST', body: undefined, headers: {} })
  })

  it('accepts an empty response', async () => {
    const mock = mockFetch(204, '')
    await expect(postWithoutResponse('/x', { a: 1 })).resolves.toBeUndefined()
    expect(mock).toHaveBeenCalledWith('/api/x', expect.objectContaining({ body: '{"a":1}' }))
  })

  it('patches JSON', async () => {
    const mock = mockFetch(200, '{"ok":true}')
    await patchJson('/x', schema, { b: 2 })
    expect(mock).toHaveBeenCalledWith('/api/x', {
      method: 'PATCH',
      body: '{"b":2}',
      headers: { 'Content-Type': 'application/json' },
    })
  })
})
