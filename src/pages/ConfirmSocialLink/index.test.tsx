import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { fireEvent, render, screen } from '@testing-library/react'
import { StrictMode } from 'react'
import { MemoryRouter } from 'react-router'
import { SWRConfig } from 'swr'
import { i18next } from '../../shared/i18n/i18n'
import { ColorModeProvider } from '../../shared/theme/ColorModeProvider'
import { ConfirmSocialLink } from '.'

const preview = { provider: 'facebook', profileName: 'Ana FB', email: 'ana@example.com' }

type Answer = { status: number; body?: object }

const mockRoutes = (routes: Record<string, Answer>) => {
  const mock = jest.fn<typeof fetch>(async (input) => {
    const answer = routes[String(input)] ?? { status: 500 }
    return new Response(answer.body ? JSON.stringify(answer.body) : null, { status: answer.status })
  })
  globalThis.fetch = mock
  return mock
}

const calls = (mock: ReturnType<typeof mockRoutes>, path: string) =>
  mock.mock.calls.filter(([input]) => String(input) === path)

const renderAt = (path: string) =>
  render(
    <StrictMode>
      <SWRConfig value={{ provider: () => new Map() }}>
        <ColorModeProvider>
          <MemoryRouter initialEntries={[path]}>
            <ConfirmSocialLink />
          </MemoryRouter>
        </ColorModeProvider>
      </SWRConfig>
    </StrictMode>,
  )

describe('ConfirmSocialLink', () => {
  beforeEach(async () => {
    await i18next.changeLanguage('en')
  })

  it('shows the profile and the email once, and confirms nothing just by opening', async () => {
    const mock = mockRoutes({ '/api/auth/social/link/preview': { status: 200, body: preview } })
    renderAt('/confirm-social-link?token=t1')

    expect(screen.getByText('Loading the request…')).toBeInTheDocument()
    expect(await screen.findByText('Link the Facebook profile "Ana FB" to the account ana@example.com?')).toBeInTheDocument()
    expect(calls(mock, '/api/auth/social/link/preview')).toHaveLength(1)
    expect(calls(mock, '/api/auth/social/link/confirm')).toHaveLength(0)
    expect(mock.mock.calls[0]?.[1]).toMatchObject({ body: '{"token":"t1"}' })
  })

  it('confirms and offers to continue with Facebook', async () => {
    const mock = mockRoutes({
      '/api/auth/social/link/preview': { status: 200, body: preview },
      '/api/auth/social/link/confirm': { status: 204 },
    })
    renderAt('/confirm-social-link?token=t1')
    fireEvent.click(await screen.findByRole('button', { name: 'Confirm' }))

    expect(await screen.findByText('Facebook linked to your account. Now just continue with Facebook.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Continue with Facebook' })).toHaveAttribute(
      'href',
      '/api/auth/facebook/start?language=en',
    )
    expect(calls(mock, '/api/auth/social/link/confirm')).toHaveLength(1)
  })

  it('declines and links nothing', async () => {
    const mock = mockRoutes({
      '/api/auth/social/link/preview': { status: 200, body: preview },
      '/api/auth/social/link/decline': { status: 204 },
    })
    renderAt('/confirm-social-link?token=t1')
    fireEvent.click(await screen.findByRole('button', { name: 'This was not me' }))

    expect(await screen.findByText('Request declined. Nothing was linked to your account.')).toBeInTheDocument()
    expect(calls(mock, '/api/auth/social/link/confirm')).toHaveLength(0)
  })

  it('offers a new Facebook entry for an invalid link', async () => {
    mockRoutes({ '/api/auth/social/link/preview': { status: 400, body: { error: 'invalid_social_link' } } })
    renderAt('/confirm-social-link?token=old')
    expect(await screen.findByText(/This link is invalid, has expired or was already used/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Continue with Facebook' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Go to sign in' })).toHaveAttribute('href', '/login')
  })

  it('treats a missing token as an invalid link, without calling the API', () => {
    const mock = mockRoutes({})
    renderAt('/confirm-social-link')
    expect(screen.getByText(/This link is invalid/)).toBeInTheDocument()
    expect(mock).not.toHaveBeenCalled()
  })

  it('tells when the link was spent between the preview and the confirmation', async () => {
    mockRoutes({
      '/api/auth/social/link/preview': { status: 200, body: preview },
      '/api/auth/social/link/confirm': { status: 400, body: { error: 'invalid_social_link' } },
    })
    renderAt('/confirm-social-link?token=t1')
    fireEvent.click(await screen.findByRole('button', { name: 'Confirm' }))
    expect(await screen.findByText(/This link is invalid/)).toBeInTheDocument()
  })

  it('keeps the buttons after a failure of the service', async () => {
    mockRoutes({
      '/api/auth/social/link/preview': { status: 200, body: preview },
      '/api/auth/social/link/confirm': { status: 503, body: { error: 'service_unavailable' } },
    })
    renderAt('/confirm-social-link?token=t1')
    fireEvent.click(await screen.findByRole('button', { name: 'Confirm' }))
    expect(await screen.findByText('We could not finish it right now. Try again in a moment.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeEnabled()
  })

  it('tells when the preview is unavailable', async () => {
    mockRoutes({ '/api/auth/social/link/preview': { status: 503, body: { error: 'service_unavailable' } } })
    renderAt('/confirm-social-link?token=t1')
    expect(await screen.findByText('We could not finish it right now. Try again in a moment.')).toBeInTheDocument()
  })
})
