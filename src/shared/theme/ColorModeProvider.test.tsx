import { afterEach, expect, it } from '@jest/globals'
import { fireEvent, render, screen } from '@testing-library/react'
import { useColorMode } from './color-mode-context'
import { ColorModeProvider } from './ColorModeProvider'

function Probe() {
  const { mode, setMode } = useColorMode()
  return <button onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}>{mode}</button>
}

const setMatchMedia = (value: ((query: string) => MediaQueryList) | undefined) => {
  Object.defineProperty(window, 'matchMedia', { configurable: true, writable: true, value })
}

const mockSystem = (dark: boolean) => {
  setMatchMedia((query) => ({
    matches: dark,
    media: query,
    onchange: null,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    addListener: () => undefined,
    removeListener: () => undefined,
    dispatchEvent: () => true,
  }))
}

const renderProbe = () =>
  render(
    <ColorModeProvider>
      <Probe />
    </ColorModeProvider>,
  )

afterEach(() => {
  setMatchMedia(undefined)
})

it('follows the system by default', () => {
  mockSystem(true)
  renderProbe()
  expect(screen.getByRole('button')).toHaveTextContent('dark')
})

it('uses light when the system preference is unavailable', () => {
  renderProbe()
  expect(screen.getByRole('button')).toHaveTextContent('light')
})

it('saves the choice in sessionStorage', () => {
  mockSystem(false)
  renderProbe()
  fireEvent.click(screen.getByRole('button'))
  expect(screen.getByRole('button')).toHaveTextContent('dark')
  expect(sessionStorage.getItem('theme')).toBe('dark')
  expect(localStorage.getItem('theme')).toBeNull()
})

it('prefers the session choice over the system', () => {
  mockSystem(false)
  sessionStorage.setItem('theme', 'dark')
  renderProbe()
  expect(screen.getByRole('button')).toHaveTextContent('dark')
})

it('ignores an invalid stored value', () => {
  mockSystem(false)
  sessionStorage.setItem('theme', 'blue')
  renderProbe()
  expect(screen.getByRole('button')).toHaveTextContent('light')
})
