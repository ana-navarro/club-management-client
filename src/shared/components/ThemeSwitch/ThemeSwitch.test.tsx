import { expect, it } from '@jest/globals'
import { fireEvent, render, screen } from '@testing-library/react'
import { ColorModeProvider } from '../../theme/ColorModeProvider'
import { ThemeSwitch } from './ThemeSwitch'

it('alternates between light and dark', () => {
  render(
    <ColorModeProvider>
      <ThemeSwitch />
    </ColorModeProvider>,
  )
  const control = screen.getByRole('switch')
  expect(control).not.toBeChecked()

  fireEvent.click(control)
  expect(control).toBeChecked()
  expect(sessionStorage.getItem('theme')).toBe('dark')

  fireEvent.click(control)
  expect(control).not.toBeChecked()
  expect(sessionStorage.getItem('theme')).toBe('light')
})
