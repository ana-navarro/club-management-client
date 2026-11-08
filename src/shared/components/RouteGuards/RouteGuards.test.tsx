import { expect, it } from '@jest/globals'
import { act, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { SWRConfig } from 'swr'
import { clearSession, saveSession } from '../../services/auth-token'
import { ColorModeProvider } from '../../theme/ColorModeProvider'
import { PublicOnly, RequireAuth } from './RouteGuards'

const session = { token: 'jwt', expiresAt: '2999-01-01T00:00:00Z', renewAt: '2999-01-01T00:00:00Z' }

const renderAt = (path: string) =>
  render(
    <SWRConfig value={{ provider: () => new Map() }}>
      <ColorModeProvider>
        <MemoryRouter initialEntries={[path]}>
          <Routes>
            <Route element={<PublicOnly />}>
              <Route path="/login" element={<p>public</p>} />
            </Route>
            <Route element={<RequireAuth />}>
              <Route path="/" element={<p>protected</p>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </ColorModeProvider>
    </SWRConfig>,
  )

it('sends a visitor without a token to the login', () => {
  renderAt('/')
  expect(screen.getByText('public')).toBeInTheDocument()
})

it('lets a visitor with a token in', () => {
  saveSession(session)
  renderAt('/')
  expect(screen.getByText('protected')).toBeInTheDocument()
})

it('sends a signed-in user away from the login', () => {
  saveSession(session)
  renderAt('/login')
  expect(screen.getByText('protected')).toBeInTheDocument()
})

it('shows the login to a visitor without a token', () => {
  renderAt('/login')
  expect(screen.getByText('public')).toBeInTheDocument()
})

it('leaves the protected page as soon as the session ends', () => {
  saveSession(session)
  renderAt('/')
  act(() => clearSession())
  expect(screen.getByText('public')).toBeInTheDocument()
})
