import { beforeEach, expect, it } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { SWRConfig } from 'swr'
import { i18next } from '../../shared/i18n/i18n'
import { ColorModeProvider } from '../../shared/theme/ColorModeProvider'
import { ForgotPassword } from '.'

const renderAt = (path: string) =>
  render(
    <SWRConfig value={{ provider: () => new Map() }}>
      <ColorModeProvider>
        <MemoryRouter initialEntries={[path]}>
          <ForgotPassword />
        </MemoryRouter>
      </ColorModeProvider>
    </SWRConfig>,
  )

beforeEach(async () => {
  await i18next.changeLanguage('en')
})

it('asks for the email without a token', () => {
  renderAt('/forgot-password')
  expect(screen.getByRole('heading', { level: 1, name: 'Forgot my password' })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Send link' })).toBeInTheDocument()
})

it('asks for the new password with a token', () => {
  renderAt('/forgot-password?token=abc')
  expect(screen.getByRole('heading', { level: 1, name: 'Create a new password' })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Save password' })).toBeInTheDocument()
})
