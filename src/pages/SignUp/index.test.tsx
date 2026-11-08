import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { SWRConfig } from 'swr'
import { i18next } from '../../shared/i18n/i18n'
import { ColorModeProvider } from '../../shared/theme/ColorModeProvider'
import { SignUp } from '.'

const mockFetch = (status: number, body?: object) => {
  const mock = jest.fn<typeof fetch>(async () => new Response(body ? JSON.stringify(body) : null, { status }))
  globalThis.fetch = mock
  return mock
}

const renderPage = () =>
  render(
    <SWRConfig value={{ provider: () => new Map() }}>
      <ColorModeProvider>
        <MemoryRouter>
          <SignUp />
        </MemoryRouter>
      </ColorModeProvider>
    </SWRConfig>,
  )

const fill = (values: { name?: string; email?: string; password?: string; confirmation?: string }) => {
  const labels: [keyof typeof values, string][] = [
    ['name', 'Name'],
    ['email', 'Email'],
    ['password', 'Password'],
    ['confirmation', 'Confirm password'],
  ]
  for (const [field, label] of labels) {
    const value = values[field]
    if (value !== undefined) fireEvent.change(screen.getByLabelText(label), { target: { value } })
  }
}
const submit = () => fireEvent.click(screen.getByRole('button', { name: 'Create account' }))
const valid = { name: ' Ana ', email: ' ana@example.com ', password: 'long-enough', confirmation: 'long-enough' }

describe('SignUp', () => {
  beforeEach(async () => {
    await i18next.changeLanguage('en')
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('sends the validated data with the session language, then asks to check the email', async () => {
    const mock = mockFetch(202)
    renderPage()
    fill(valid)
    submit()

    expect(await screen.findByRole('heading', { level: 1, name: 'Check your email' })).toBeInTheDocument()
    expect(screen.getByText(/We sent a confirmation link to ana@example.com/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Resend link' })).toBeInTheDocument()
    expect(mock).toHaveBeenCalledWith(
      '/api/auth/register',
      expect.objectContaining({
        body: JSON.stringify({ name: 'Ana', email: 'ana@example.com', password: 'long-enough', language: 'en' }),
      }),
    )
  })

  it('shows every field error and sends nothing', () => {
    const mock = mockFetch(202)
    renderPage()
    submit()
    expect(screen.getAllByText('This field is required.')).toHaveLength(4)
    expect(mock).not.toHaveBeenCalled()
  })

  it('refuses a short password, a different confirmation and an invalid email', () => {
    const mock = mockFetch(202)
    renderPage()
    fill({ name: 'Ana', email: 'nope', password: 'short', confirmation: 'other' })
    submit()
    expect(screen.getByText('Enter a valid email.')).toBeInTheDocument()
    expect(screen.getByText('The password must have at least 8 characters.')).toBeInTheDocument()
    expect(screen.getByText('The passwords do not match.')).toBeInTheDocument()
    expect(mock).not.toHaveBeenCalled()
  })

  it('refuses a name longer than 100 characters', () => {
    mockFetch(202)
    renderPage()
    fill({ ...valid, name: 'a'.repeat(101) })
    submit()
    expect(screen.getByText('This text is too long.')).toBeInTheDocument()
  })

  it('sends once while the first request is running', async () => {
    let finish: (response: Response) => void = () => undefined
    const mock = jest.fn<typeof fetch>(() => new Promise<Response>((resolve) => { finish = resolve }))
    globalThis.fetch = mock
    renderPage()
    fill(valid)
    submit()
    await waitFor(() => expect(screen.getByRole('button', { name: 'Create account' })).toBeDisabled())
    submit()
    finish(new Response(null, { status: 202 }))
    await screen.findByRole('heading', { level: 1, name: 'Check your email' })
    expect(mock).toHaveBeenCalledTimes(1)
  })

  it.each([
    [429, { error: 'too_many_requests' }, 'Too many sign-ups from this network. Try again later.'],
    [400, { error: 'weak_password' }, 'The password must have at least 8 characters.'],
    [503, { error: 'service_unavailable' }, 'We could not create the account right now. Try again in a moment.'],
  ])('shows the message for a %s answer', async (status, body, message) => {
    mockFetch(status, body)
    renderPage()
    fill(valid)
    submit()
    expect(await screen.findByRole('alert')).toHaveTextContent(message)
    expect(screen.getByRole('heading', { level: 1, name: 'Create account' })).toBeInTheDocument()
  })

  it('links back to the login', () => {
    renderPage()
    expect(screen.getByRole('link', { name: 'Already have an account? Sign in' })).toHaveAttribute('href', '/login')
  })
})
