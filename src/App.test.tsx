import { expect, it } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import { App } from './App'

it('renders the home page', () => {
  render(<App />)
  expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
})
