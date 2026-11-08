import { expect, it, jest } from '@jest/globals'
import { act, renderHook } from '@testing-library/react'
import { useResetPassword } from './useResetPassword'

it('posts the link token and the new password', async () => {
  const mock = jest.fn<typeof fetch>(async () => new Response(null, { status: 204 }))
  globalThis.fetch = mock

  const { result } = renderHook(() => useResetPassword())
  await act(async () => {
    await result.current.trigger({ token: 't', password: 'long-enough' })
  })

  expect(mock).toHaveBeenCalledWith(
    '/api/auth/reset-password',
    expect.objectContaining({ body: '{"token":"t","password":"long-enough"}' }),
  )
})
