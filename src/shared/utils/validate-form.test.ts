import { describe, expect, it } from '@jest/globals'
import { z } from 'zod'
import { emailField, passwordField, validateForm } from './validate-form'

const schema = z.object({ email: emailField, password: passwordField })

describe('validateForm', () => {
  it('returns the cleaned values', () => {
    expect(validateForm(schema, { email: ' ana.silva+x@club.com.br ', password: ' secret ' })).toEqual({
      success: true,
      data: { email: 'ana.silva+x@club.com.br', password: ' secret ' },
    })
  })

  it('reports each field, with its first message', () => {
    expect(validateForm(schema, { email: '', password: '' })).toEqual({
      success: false,
      errors: { email: 'validation.required', password: 'validation.required' },
    })
  })

  it.each(['ana', 'ana@', '@b.co', 'a b@c.co', 'a@b', `${'a'.repeat(250)}@b.co`])('refuses the email %s', (email) => {
    expect(validateForm(schema, { email, password: 'secret' })).toEqual({
      success: false,
      errors: { email: 'validation.email' },
    })
  })

  it('refuses a password that is too long', () => {
    expect(validateForm(schema, { email: 'a@b.co', password: 'x'.repeat(257) })).toEqual({
      success: false,
      errors: { password: 'validation.tooLong' },
    })
  })
})
