import { expect, it, jest } from '@jest/globals'
import { act, renderHook } from '@testing-library/react'
import { useForgotPassword } from './useForgotPassword'

it('posts the email and the language', async () => {
  const mock = jest.fn<typeof fetch>(async () => new Response(null, { status: 202 }))
  globalThis.fetch = mock

  const { result } = renderHook(() => useForgotPassword())
  await act(async () => {
    await result.current.trigger({ email: 'a@b.co', language: 'en' })
  })

  expect(mock).toHaveBeenCalledWith(
    '/api/auth/forgot-password',
    expect.objectContaining({ body: '{"email":"a@b.co","language":"en"}' }),
  )
})
