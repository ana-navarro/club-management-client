import { beforeEach, expect, it, jest } from '@jest/globals'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { SWRConfig } from 'swr'
import { i18next } from '../../shared/i18n/i18n'
import { clearSession, readSessionNotice } from '../../shared/services/auth-token'
import { ColorModeProvider } from '../../shared/theme/ColorModeProvider'
import { Login } from '.'

const renderPage = (state?: { passwordChanged: boolean }, search = '') =>
  render(
    <SWRConfig value={{ provider: () => new Map() }}>
      <ColorModeProvider>
        <MemoryRouter initialEntries={[{ pathname: '/login', search, state }]}>
          <Login />
        </MemoryRouter>
      </ColorModeProvider>
    </SWRConfig>,
  )

beforeEach(async () => {
  await i18next.changeLanguage('en')
})

it('links to the sign-up with the secondary button', () => {
  renderPage()
  expect(screen.getByRole('heading', { level: 1, name: 'Sign in' })).toBeInTheDocument()
  const signUp = screen.getByRole('link', { name: 'Create account' })
  expect(signUp).toHaveAttribute('href', '/signup')
  expect(signUp.className).toContain('MuiButton-colorSecondary')
})

it('offers a new confirmation link when the email is not confirmed', async () => {
  globalThis.fetch = jest.fn<typeof fetch>(
    async () => new Response(JSON.stringify({ error: 'email_not_verified' }), { status: 403 }),
  )
  renderPage()
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'ana@example.com' } })
  fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'secret' } })
  fireEvent.click(screen.getByRole('button', { name: 'Sign in' }))

  expect(await screen.findByText(/Confirm your email before signing in/)).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Resend link' })).toBeInTheDocument()
  expect(screen.queryByText(/Invalid email or password/)).toBeNull()
})

it('tells that the session expired, only once', () => {
  clearSession('expired')
  renderPage()
  expect(screen.getByText('Your session has expired. Sign in again.')).toBeInTheDocument()
  expect(readSessionNotice()).toBeNull()
})

it('shows no notice by default', () => {
  renderPage()
  expect(screen.queryByRole('alert')).toBeNull()
})

it('confirms a password change', () => {
  renderPage({ passwordChanged: true })
  expect(screen.getByText('Password changed. Sign in with the new password.')).toBeInTheDocument()
})

it('offers Google and Facebook', () => {
  renderPage()
  expect(screen.getByRole('link', { name: 'Continue with Google' })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: 'Continue with Facebook' })).toBeInTheDocument()
})

it.each([
  ['cancelled', 'Sign-in was cancelled.'],
  ['email_required', 'The provider did not share a verified email.'],
  ['invalid_credentials', 'Invalid email or password.'],
  ['provider_unavailable', 'We could not sign you in with the provider right now.'],
  ['invalid_state', 'The sign-in expired or was opened in another browser.'],
  ['anything_else', 'We could not sign you in with the provider right now.'],
])('shows the message for social_error=%s', (code, message) => {
  renderPage(undefined, `?social_error=${code}`)
  expect(screen.getByRole('alert')).toHaveTextContent(message)
})

it('asks to check the email after a first Facebook entry', () => {
  renderPage(undefined, '?social_notice=check_email')
  expect(screen.getByText(/We sent a link to the email of your Facebook account/)).toBeInTheDocument()
})

it('ignores an unknown notice', () => {
  renderPage(undefined, '?social_notice=other')
  expect(screen.queryByRole('alert')).toBeNull()
})
