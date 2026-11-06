import { expect, it } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import { AppButton } from './AppButton'

it('is enabled by default', () => {
  render(<AppButton>Salvar</AppButton>)
  expect(screen.getByRole('button', { name: 'Salvar' })).toBeEnabled()
})

it('is disabled and shows progress while loading', () => {
  render(<AppButton loading>Salvar</AppButton>)
  expect(screen.getByRole('button', { name: 'Salvar' })).toBeDisabled()
  expect(screen.getByRole('button', { name: 'Salvar' })).toHaveAttribute('aria-busy', 'true')
})
