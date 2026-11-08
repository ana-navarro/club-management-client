import { expect, it } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import { ColorModeProvider } from '../../theme/ColorModeProvider'
import { PublicLayout } from './PublicLayout'

it('shows the title, the content and both switches', () => {
  render(
    <ColorModeProvider>
      <PublicLayout title="Page title">
        <p>Content</p>
      </PublicLayout>
    </ColorModeProvider>,
  )
  expect(screen.getByRole('heading', { level: 1, name: 'Page title' })).toBeInTheDocument()
  expect(screen.getByText('Content')).toBeInTheDocument()
  expect(screen.getAllByRole('switch')).toHaveLength(2)
})
