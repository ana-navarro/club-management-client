import { expect, it } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import { Home } from '.'

it('shows the application title', () => {
  render(<Home />)
  expect(screen.getByRole('heading', { name: 'Club Management' })).toBeInTheDocument()
})
