import { beforeEach, expect, it, jest } from '@jest/globals'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { SWRConfig } from 'swr'
import { i18next } from '../../../shared/i18n/i18n'
import { ForgotPasswordForm } from './ForgotPasswordForm'

const mockResponse = (status: number) => {
  const mock = jest.fn<typeof fetch>(async () => new Response(null, { status }))
  globalThis.fetch = mock
  return mock
}

const renderForm = () =>
  render(
    <SWRConfig value={{ provider: () => new Map() }}>
      <MemoryRouter>
        <ForgotPasswordForm />
      </MemoryRouter>
    </SWRConfig>,
  )

const submit = (email: string) => {
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: email } })
  fireEvent.click(screen.getByRole('button', { name: 'Send link' }))
}

beforeEach(async () => {
  await i18next.changeLanguage('en')
})

it.each([
  ['', 'This field is required.'],
  ['nope', 'Enter a valid email.'],
])('does not send "%s"', (email, message) => {
  const mock = mockResponse(202)
  renderForm()
  submit(email)
  expect(screen.getByText(message)).toBeInTheDocument()
  expect(mock).not.toHaveBeenCalled()
})

it('shows the generic message and sends the page language', async () => {
  const mock = mockResponse(202)
  renderForm()
  submit('a@b.co')
  expect(await screen.findByText('If the email is registered, we will send a link to create a new password.')).toBeInTheDocument()
  expect(mock).toHaveBeenCalledWith(
    '/api/auth/forgot-password',
    expect.objectContaining({ body: '{"email":"a@b.co","language":"en"}' }),
  )
})

it('tells when sending failed', async () => {
  mockResponse(500)
  renderForm()
  submit('a@b.co')
  expect(await screen.findByRole('alert')).toHaveTextContent('We could not send it right now.')
})

it('links back to the login', () => {
  renderForm()
  expect(screen.getByRole('link', { name: 'Back to sign in' })).toHaveAttribute('href', '/login')
})
