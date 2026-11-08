import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { SWRConfig } from 'swr'
import { i18next } from '../../../shared/i18n/i18n'
import { getToken } from '../../../shared/services/auth-token'
import { ColorModeProvider } from '../../../shared/theme/ColorModeProvider'
import { LoginForm } from './LoginForm'

const success = {
  token: 'jwt',
  expiresAt: '2999-01-01T02:00:00Z',
  renewAt: '2999-01-01T01:30:00Z',
  user: { id: 'u', name: 'Ana', email: 'a@b.co', type: 'CLIENT', clubs: [], preferences: { theme: 'dark', language: 'en' } },
}

const mockResponse = (status: number, body: object) => {
  const mock = jest.fn<typeof fetch>(async () => new Response(JSON.stringify(body), { status }))
  globalThis.fetch = mock
  return mock
}

const renderForm = () =>
  render(
    <SWRConfig value={{ provider: () => new Map() }}>
      <ColorModeProvider>
        <MemoryRouter>
          <LoginForm />
        </MemoryRouter>
      </ColorModeProvider>
    </SWRConfig>,
  )

const fill = (email: string, password: string) => {
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: email } })
  fireEvent.change(screen.getByLabelText('Password'), { target: { value: password } })
}
const submit = () => fireEvent.click(screen.getByRole('button', { name: 'Sign in' }))

describe('LoginForm', () => {
  beforeEach(async () => {
    await i18next.changeLanguage('en')
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('does not send empty fields', () => {
    const mock = mockResponse(200, success)
    renderForm()
    submit()
    expect(screen.getAllByText('This field is required.')).toHaveLength(2)
    expect(mock).not.toHaveBeenCalled()
  })

  it('does not send an invalid email', () => {
    const mock = mockResponse(200, success)
    renderForm()
    fill('nope', 'secret')
    submit()
    expect(screen.getByText('Enter a valid email.')).toBeInTheDocument()
    expect(mock).not.toHaveBeenCalled()
  })

  it('saves the session and applies the returned preferences', async () => {
    const mock = mockResponse(200, success)
    sessionStorage.setItem('theme', 'light')
    sessionStorage.setItem('language', 'en')
    renderForm()
    fill(' a@b.co ', 'secret')
    submit()

    await waitFor(() => expect(getToken()).toBe('jwt'))
    expect(sessionStorage.getItem('session')).not.toContain('Ana')
    expect(sessionStorage.getItem('theme')).toBe('dark')
    expect(mock).toHaveBeenCalledWith(
      '/api/auth/login',
      expect.objectContaining({
        body: JSON.stringify({ email: 'a@b.co', password: 'secret', preferences: { theme: 'light', language: 'en' } }),
      }),
    )
  })

  it('sends no preferences when the session has no choice', async () => {
    const mock = mockResponse(200, success)
    renderForm()
    fill('a@b.co', 'secret')
    submit()
    await waitFor(() => expect(getToken()).toBe('jwt'))
    expect(mock.mock.calls[0]).toEqual([
      '/api/auth/login',
      expect.objectContaining({ body: '{"email":"a@b.co","password":"secret","preferences":{}}' }),
    ])
  })

  it('disables the button while sending', async () => {
    let finish: (response: Response) => void = () => undefined
    globalThis.fetch = jest.fn<typeof fetch>(() => new Promise<Response>((resolve) => { finish = resolve }))
    renderForm()
    fill('a@b.co', 'secret')
    submit()

    await waitFor(() => expect(screen.getByRole('button', { name: 'Sign in' })).toBeDisabled())
    finish(new Response(JSON.stringify(success), { status: 200 }))
    await waitFor(() => expect(getToken()).toBe('jwt'))
  })

  it('shows the same message for invalid credentials and stays on the page', async () => {
    mockResponse(401, { error: 'invalid_credentials' })
    renderForm()
    fill('a@b.co', 'wrong')
    submit()
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Invalid email or password. After 3 wrong attempts, we send an email to the account.',
    )
    expect(getToken()).toBeNull()
  })

  it('tells when the service is unavailable', async () => {
    mockResponse(503, { error: 'service_unavailable' })
    renderForm()
    fill('a@b.co', 'secret')
    submit()
    expect(await screen.findByRole('alert')).toHaveTextContent('We could not sign you in right now.')
  })

  it('links to the password recovery', () => {
    renderForm()
    expect(screen.getByRole('link', { name: 'Forgot my password' })).toHaveAttribute('href', '/forgot-password')
  })
})
