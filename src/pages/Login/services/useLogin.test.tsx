import { expect, it, jest } from '@jest/globals'
import { act, renderHook } from '@testing-library/react'
import { makeUser } from '../../../shared/services/user.mock'
import { useLogin } from './useLogin'

const body = { email: 'a@b.co', password: 'p', preferences: {} }
const success = { token: 'jwt', expiresAt: 'a', renewAt: 'b', user: makeUser() }

it('posts the credentials and the session preferences', async () => {
  const mock = jest.fn<typeof fetch>(async () => new Response(JSON.stringify(success), { status: 200 }))
  globalThis.fetch = mock

  const { result } = renderHook(() => useLogin())
  await act(async () => {
    await expect(result.current.trigger({ ...body, preferences: { theme: 'dark' } })).resolves.toEqual(success)
  })

  expect(mock).toHaveBeenCalledWith(
    '/api/auth/login',
    expect.objectContaining({ body: '{"email":"a@b.co","password":"p","preferences":{"theme":"dark"}}' }),
  )
})

it('rejects on failure', async () => {
  globalThis.fetch = jest.fn<typeof fetch>(async () => new Response('{"error":"invalid_credentials"}', { status: 401 }))

  const { result } = renderHook(() => useLogin())
  await act(async () => {
    await expect(result.current.trigger(body)).rejects.toMatchObject({ status: 401 })
  })
})
