import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { fireEvent, render, screen } from '@testing-library/react'
import { SWRConfig } from 'swr'
import { i18next } from '../../i18n/i18n'
import { ResendVerification } from './ResendVerification'

const mockFetch = (status: number) => {
  const mock = jest.fn<typeof fetch>(async () => new Response(null, { status }))
  globalThis.fetch = mock
  return mock
}

const renderWith = (email?: string) =>
  render(
    <SWRConfig value={{ provider: () => new Map() }}>
      <ResendVerification email={email} />
    </SWRConfig>,
  )

describe('ResendVerification', () => {
  beforeEach(async () => {
    await i18next.changeLanguage('en')
  })

  it('resends to a known email with a single button', async () => {
    const mock = mockFetch(202)
    renderWith('ana@example.com')
    expect(screen.queryByLabelText('Email')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Resend link' }))
    expect(await screen.findByText('If the account still needs confirmation, we sent a new link.')).toBeInTheDocument()
    expect(mock).toHaveBeenCalledWith(
      '/api/auth/resend-verification',
      expect.objectContaining({ body: '{"email":"ana@example.com","language":"en"}' }),
    )
  })

  it('asks for the email and validates it before sending', () => {
    const mock = mockFetch(202)
    renderWith()
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'nope' } })
    fireEvent.click(screen.getByRole('button', { name: 'Resend link' }))
    expect(screen.getByText('Enter a valid email.')).toBeInTheDocument()
    expect(mock).not.toHaveBeenCalled()
  })

  it('sends the typed email, trimmed', async () => {
    const mock = mockFetch(202)
    renderWith()
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: ' ana@example.com ' } })
    fireEvent.click(screen.getByRole('button', { name: 'Resend link' }))
    await screen.findByText('If the account still needs confirmation, we sent a new link.')
    expect(mock.mock.calls[0]?.[1]).toMatchObject({ body: '{"email":"ana@example.com","language":"en"}' })
  })

  it('tells when the service is unavailable', async () => {
    mockFetch(503)
    renderWith('ana@example.com')
    fireEvent.click(screen.getByRole('button', { name: 'Resend link' }))
    expect(await screen.findByText('We could not send it right now. Try again in a moment.')).toBeInTheDocument()
  })
})
