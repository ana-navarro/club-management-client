import { afterEach, expect, it, jest } from '@jest/globals'
import { z } from 'zod'
import { getJson } from './http-client'

const schema = z.object({ status: z.string() })

const mockFetch = (body: object, status: number) => {
  const mock = jest.fn<typeof fetch>(async () => new Response(JSON.stringify(body), { status }))
  globalThis.fetch = mock
  return mock
}

afterEach(() => {
  jest.restoreAllMocks()
})

it('requests the path under the API base and returns the validated body', async () => {
  const mock = mockFetch({ status: 'ok' }, 200)
  await expect(getJson('/health', schema)).resolves.toEqual({ status: 'ok' })
  expect(mock).toHaveBeenCalledWith('/api/health')
})

it('throws when the response is not ok', async () => {
  mockFetch({}, 500)
  await expect(getJson('/health', schema)).rejects.toThrow('Request to /health failed with status 500')
})

it('throws when the body does not match the schema', async () => {
  mockFetch({ other: 1 }, 200)
  await expect(getJson('/health', schema)).rejects.toThrow()
})
