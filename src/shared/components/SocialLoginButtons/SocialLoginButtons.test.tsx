import { beforeEach, describe, expect, it } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import { i18next } from '../../i18n/i18n'
import { socialStartPath } from '../../utils/social-start-path'
import { SocialLoginButtons } from './SocialLoginButtons'

describe('SocialLoginButtons', () => {
  beforeEach(async () => {
    await i18next.changeLanguage('en')
  })

  it('links both providers to their start in the same tab, with the session language', () => {
    render(<SocialLoginButtons />)
    const google = screen.getByRole('link', { name: 'Continue with Google' })
    const facebook = screen.getByRole('link', { name: 'Continue with Facebook' })
    expect(google).toHaveAttribute('href', '/api/auth/google/start?language=en')
    expect(facebook).toHaveAttribute('href', '/api/auth/facebook/start?language=en')
    expect(google).not.toHaveAttribute('target')
  })

  it('translates the buttons and the language of the start', async () => {
    await i18next.changeLanguage('pt-BR')
    render(<SocialLoginButtons />)
    expect(screen.getByRole('link', { name: 'Continuar com Google' })).toHaveAttribute(
      'href',
      '/api/auth/google/start?language=pt-BR',
    )
  })

  it('shows only the chosen providers', () => {
    render(<SocialLoginButtons providers={['facebook']} />)
    expect(screen.queryByRole('link', { name: 'Continue with Google' })).toBeNull()
    expect(screen.getByRole('link', { name: 'Continue with Facebook' })).toBeInTheDocument()
  })

  it('falls back to English for an unknown language', () => {
    expect(socialStartPath('google', 'fr')).toBe('/api/auth/google/start?language=en')
  })
})
