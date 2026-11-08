import { afterEach, expect, it, jest } from '@jest/globals'
import { act, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { SWRConfig } from 'swr'
import { useUpdatePreferences } from './useUpdatePreferences'
import { userResponse } from './user.mock'

const wrapper = ({ children }: { children: ReactNode }) => (
  <SWRConfig value={{ provider: () => new Map() }}>{children}</SWRConfig>
)

afterEach(() => {
  jest.restoreAllMocks()
})

it('sends the changed preference', async () => {
  const mock = jest.fn<typeof fetch>(async () => userResponse())
  globalThis.fetch = mock

  const { result } = renderHook(() => useUpdatePreferences(), { wrapper })
  await act(async () => {
    await result.current.trigger({ theme: 'dark' })
  })

  expect(mock).toHaveBeenCalledWith(
    '/api/users/me/preferences',
    expect.objectContaining({ method: 'PATCH', body: '{"theme":"dark"}' }),
  )
})
