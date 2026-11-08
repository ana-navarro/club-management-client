import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import { StrictMode } from 'react'
import { MemoryRouter } from 'react-router'
import { SWRConfig } from 'swr'
import { i18next } from '../../shared/i18n/i18n'
import { ColorModeProvider } from '../../shared/theme/ColorModeProvider'
import { VerifyEmail } from '.'

const mockFetch = (status: number, body?: object) => {
  const mock = jest.fn<typeof fetch>(async () => new Response(body ? JSON.stringify(body) : null, { status }))
  globalThis.fetch = mock
  return mock
}

const renderAt = (path: string) =>
  render(
    <StrictMode>
      <SWRConfig value={{ provider: () => new Map() }}>
        <ColorModeProvider>
          <MemoryRouter initialEntries={[path]}>
            <VerifyEmail />
          </MemoryRouter>
        </ColorModeProvider>
      </SWRConfig>
    </StrictMode>,
  )

describe('VerifyEmail', () => {
  beforeEach(async () => {
    await i18next.changeLanguage('en')
  })

  it('confirms once, even when StrictMode mounts the page twice, and links to the login', async () => {
    const mock = mockFetch(204)
    renderAt('/verify-email?token=abc')
    expect(screen.getByText('Confirming your email…')).toBeInTheDocument()
    expect(await screen.findByText('Email confirmed. You can now sign in.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Go to sign in' })).toHaveAttribute('href', '/login')
    expect(mock).toHaveBeenCalledTimes(1)
    expect(mock).toHaveBeenCalledWith('/api/auth/verify-email', expect.objectContaining({ body: '{"token":"abc"}' }))
  })

  it('offers a new link when the link is invalid, expired or used', async () => {
    mockFetch(400, { error: 'invalid_verification_link' })
    renderAt('/verify-email?token=old')
    expect(await screen.findByText(/This link is invalid, has expired or was already used/)).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Resend link' })).toBeInTheDocument()
  })

  it('tells when the service is unavailable', async () => {
    mockFetch(503, { error: 'service_unavailable' })
    renderAt('/verify-email?token=abc')
    expect(await screen.findByText('We could not confirm it right now. Try again in a moment.')).toBeInTheDocument()
  })

  it('treats a missing token as an invalid link, without calling the API', () => {
    const mock = mockFetch(204)
    renderAt('/verify-email')
    expect(screen.getByText(/This link is invalid/)).toBeInTheDocument()
    expect(mock).not.toHaveBeenCalled()
  })
})
