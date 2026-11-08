import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { render, screen, waitFor } from '@testing-library/react'
import { StrictMode } from 'react'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router'
import { SWRConfig } from 'swr'
import { i18next } from '../../shared/i18n/i18n'
import { getToken } from '../../shared/services/auth-token'
import { ColorModeProvider } from '../../shared/theme/ColorModeProvider'
import { SocialCallback } from '.'

const success = {
  token: 'jwt',
  expiresAt: '2999-01-01T02:00:00Z',
  renewAt: '2999-01-01T01:30:00Z',
  user: { id: 'u', name: 'Ana', email: 'a@b.co', type: 'CLIENT', clubs: [], preferences: { theme: 'dark', language: null } },
}

function Where() {
  const location = useLocation()
  return <p data-testid="where">{location.pathname + location.search}</p>
}

const renderAt = (hash: string) => {
  window.history.replaceState(null, '', `/auth/callback${hash}`)
  return render(
    <StrictMode>
      <SWRConfig value={{ provider: () => new Map() }}>
        <ColorModeProvider>
          <MemoryRouter initialEntries={['/auth/callback']}>
            <Routes>
              <Route path="/auth/callback" element={<SocialCallback />} />
              <Route path="*" element={<Where />} />
            </Routes>
          </MemoryRouter>
        </ColorModeProvider>
      </SWRConfig>
    </StrictMode>,
  )
}

const mockFetch = (status: number, body: object) => {
  const mock = jest.fn<typeof fetch>(async () => new Response(JSON.stringify(body), { status }))
  globalThis.fetch = mock
  return mock
}

describe('SocialCallback', () => {
  beforeEach(async () => {
    await i18next.changeLanguage('en')
  })

  it('trades the code once, even when StrictMode mounts twice, then goes home', async () => {
    const mock = mockFetch(200, success)
    sessionStorage.setItem('language', 'en')
    renderAt('#code=abc')

    expect(screen.getByText('Finishing sign-in…')).toBeInTheDocument()
    await waitFor(() => expect(screen.getByTestId('where')).toHaveTextContent('/'))
    expect(getToken()).toBe('jwt')
    expect(sessionStorage.getItem('theme')).toBe('dark')
    expect(mock).toHaveBeenCalledTimes(1)
    expect(mock).toHaveBeenCalledWith(
      '/api/auth/social/session',
      expect.objectContaining({ body: '{"code":"abc","language":"en"}' }),
    )
  })

  it('clears the fragment from the address', async () => {
    mockFetch(200, success)
    renderAt('#code=abc')
    await waitFor(() => expect(window.location.hash).toBe(''))
  })

  it('goes back to the login when the code is refused', async () => {
    mockFetch(401, { error: 'invalid_social_code' })
    renderAt('#code=used')
    await waitFor(() =>
      expect(screen.getByTestId('where')).toHaveTextContent('/login?social_error=invalid_state'),
    )
    expect(getToken()).toBeNull()
  })

  it('goes back to the login without a code, without calling the API', async () => {
    const mock = mockFetch(200, success)
    renderAt('')
    await waitFor(() =>
      expect(screen.getByTestId('where')).toHaveTextContent('/login?social_error=invalid_state'),
    )
    expect(mock).not.toHaveBeenCalled()
  })
})
