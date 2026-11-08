import { expect, it, jest } from '@jest/globals'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { SWRConfig } from 'swr'
import { useCurrentUser } from './useCurrentUser'
import { makeUser, userResponse } from './user.mock'

it('reads the current user', async () => {
  const mock = jest.fn<typeof fetch>(async () => userResponse())
  globalThis.fetch = mock
  const wrapper = ({ children }: { children: ReactNode }) => (
    <SWRConfig value={{ provider: () => new Map() }}>{children}</SWRConfig>
  )

  const { result } = renderHook(() => useCurrentUser(), { wrapper })

  await waitFor(() => expect(result.current.data).toEqual(makeUser()))
  expect(mock).toHaveBeenCalledWith('/api/users/me', { headers: {} })
})
