import { beforeEach, expect, it } from '@jest/globals'
import { fireEvent, render, screen } from '@testing-library/react'
import { i18next } from '../../i18n/i18n'
import { LanguageSwitch } from './LanguageSwitch'

beforeEach(async () => {
  await i18next.changeLanguage('pt-BR')
})

it('alternates between the two languages', async () => {
  render(<LanguageSwitch />)
  expect(screen.getByText('Idioma: português')).toBeInTheDocument()

  fireEvent.click(screen.getByRole('switch'))
  expect(await screen.findByText('Language: English')).toBeInTheDocument()
  expect(sessionStorage.getItem('language')).toBe('en')

  fireEvent.click(screen.getByRole('switch'))
  expect(await screen.findByText('Idioma: português')).toBeInTheDocument()
  expect(sessionStorage.getItem('language')).toBe('pt-BR')
})
