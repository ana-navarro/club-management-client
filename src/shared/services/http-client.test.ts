import { afterEach, expect, it, jest } from '@jest/globals'
import { fetcher } from './http-client'

const mockFetch = (body: unknown, ok: boolean, status: number) => {
  globalThis.fetch = jest.fn(async () => ({
    ok,
    status,
    json: async () => body,
  })) as unknown as typeof fetch
}

afterEach(() => {
  jest.restoreAllMocks()
})

it('requests the path under the API base and returns the JSON body', async () => {
  mockFetch({ status: 'ok' }, true, 200)
  await expect(fetcher('/health')).resolves.toEqual({ status: 'ok' })
  expect(globalThis.fetch).toHaveBeenCalledWith('/api/health')
})

it('throws when the response is not ok', async () => {
  mockFetch({}, false, 500)
  await expect(fetcher('/health')).rejects.toThrow('Request to /health failed with status 500')
})
