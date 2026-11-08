import { beforeEach, expect, it, jest } from '@jest/globals'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router'
import { SWRConfig } from 'swr'
import { i18next } from '../../../shared/i18n/i18n'
import { ResetPasswordForm } from './ResetPasswordForm'

const mockResponse = (status: number, body?: object) => {
  const mock = jest.fn<typeof fetch>(async () => new Response(body ? JSON.stringify(body) : null, { status }))
  globalThis.fetch = mock
  return mock
}

function LoginProbe() {
  const location = useLocation()
  return <p>login {JSON.stringify(location.state)}</p>
}

const renderForm = () =>
  render(
    <SWRConfig value={{ provider: () => new Map() }}>
      <MemoryRouter initialEntries={['/forgot-password?token=abc']}>
        <Routes>
          <Route path="/forgot-password" element={<ResetPasswordForm token="abc" />} />
          <Route path="/login" element={<LoginProbe />} />
        </Routes>
      </MemoryRouter>
    </SWRConfig>,
  )

const submit = (password: string, confirmation: string) => {
  fireEvent.change(screen.getByLabelText('New password'), { target: { value: password } })
  fireEvent.change(screen.getByLabelText('Confirm new password'), { target: { value: confirmation } })
  fireEvent.click(screen.getByRole('button', { name: 'Save password' }))
}

beforeEach(async () => {
  await i18next.changeLanguage('en')
})

it('requires a password', () => {
  const mock = mockResponse(204)
  renderForm()
  submit('', '')
  expect(screen.getByText('This field is required.')).toBeInTheDocument()
  expect(mock).not.toHaveBeenCalled()
})

it('requires the confirmation to match', () => {
  const mock = mockResponse(204)
  renderForm()
  submit('long-enough', 'different')
  expect(screen.getByText('The passwords do not match.')).toBeInTheDocument()
  expect(mock).not.toHaveBeenCalled()
})

it('sends the link token and goes to the login on success', async () => {
  const mock = mockResponse(204)
  renderForm()
  submit('long-enough', 'long-enough')
  expect(await screen.findByText('login {"passwordChanged":true}')).toBeInTheDocument()
  expect(mock).toHaveBeenCalledWith(
    '/api/auth/reset-password',
    expect.objectContaining({ body: '{"token":"abc","password":"long-enough"}' }),
  )
})

it('does not send a password that is too short', () => {
  const mock = mockResponse(204)
  renderForm()
  submit('short', 'short')
  expect(screen.getByText('The password must have at least 8 characters.')).toBeInTheDocument()
  expect(mock).not.toHaveBeenCalled()
})

it('shows the password rule returned by the backend and stays usable', async () => {
  mockResponse(400, { error: 'weak_password' })
  renderForm()
  submit('long-enough', 'long-enough')
  expect(await screen.findByText('The password must have at least 8 characters.')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Save password' })).toBeInTheDocument()
})

it('offers another link when this one is invalid', async () => {
  mockResponse(400, { error: 'invalid_reset_link' })
  renderForm()
  submit('long-enough', 'long-enough')
  expect(await screen.findByRole('alert')).toHaveTextContent('This link is invalid, has expired or was already used.')
  expect(screen.getByRole('link', { name: 'Request another link' })).toHaveAttribute('href', '/forgot-password')
})

it('tells when saving failed', async () => {
  mockResponse(503, { error: 'service_unavailable' })
  renderForm()
  submit('long-enough', 'long-enough')
  expect(await screen.findByRole('alert')).toHaveTextContent('We could not save it right now.')
})

it('tells when the network failed', async () => {
  globalThis.fetch = jest.fn<typeof fetch>(async () => {
    throw new TypeError('offline')
  })
  renderForm()
  submit('long-enough', 'long-enough')
  expect(await screen.findByRole('alert')).toHaveTextContent('We could not save it right now.')
})
