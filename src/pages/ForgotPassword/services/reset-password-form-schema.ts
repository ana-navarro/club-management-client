import { z } from 'zod'
import { passwordField } from '../../../shared/utils/validate-form'

const MINIMUM_PASSWORD_LENGTH = 8

export const resetPasswordFormSchema = z
  .object({
    password: passwordField.min(MINIMUM_PASSWORD_LENGTH, 'resetPassword.weak'),
    confirmation: z.string(),
  })
  .refine((form) => form.password === form.confirmation, {
    path: ['confirmation'],
    message: 'resetPassword.mismatch',
  })
