import { beforeEach, expect, it, jest } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import { SWRConfig } from 'swr'
import { i18next } from '../../shared/i18n/i18n'
import { userResponse } from '../../shared/services/user.mock'
import { ColorModeProvider } from '../../shared/theme/ColorModeProvider'
import { Home } from '.'

const renderPage = () =>
  render(
    <SWRConfig value={{ provider: () => new Map() }}>
      <ColorModeProvider>
        <Home />
      </ColorModeProvider>
    </SWRConfig>,
  )

beforeEach(async () => {
  await i18next.changeLanguage('en')
})

it('shows the title and the switches while loading', () => {
  globalThis.fetch = jest.fn<typeof fetch>(() => new Promise(() => undefined))
  renderPage()
  expect(screen.getByRole('heading', { name: 'Club Management' })).toBeInTheDocument()
  expect(screen.getAllByRole('switch')).toHaveLength(2)
})

it('greets the user', async () => {
  globalThis.fetch = jest.fn<typeof fetch>(async () => userResponse())
  renderPage()
  expect(await screen.findByText('Hello, Ana')).toBeInTheDocument()
})
