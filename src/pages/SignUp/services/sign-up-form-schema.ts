import { z } from 'zod'
import { emailField } from '../../../shared/utils/validate-form'

const MAXIMUM_NAME_LENGTH = 100
const MINIMUM_PASSWORD_LENGTH = 8
const MAXIMUM_PASSWORD_LENGTH = 256

// Only the format: the backend still decides (constitution, forms).
export const signUpFormSchema = z
  .object({
    name: z.string().trim().min(1, 'validation.required').max(MAXIMUM_NAME_LENGTH, 'validation.tooLong'),
    email: emailField,
    password: z
      .string()
      .min(1, 'validation.required')
      .min(MINIMUM_PASSWORD_LENGTH, 'resetPassword.weak')
      .max(MAXIMUM_PASSWORD_LENGTH, 'validation.tooLong'),
    confirmation: z.string().min(1, 'validation.required'),
  })
  .refine((form) => form.password === form.confirmation, {
    path: ['confirmation'],
    message: 'resetPassword.mismatch',
  })

export type SignUpForm = z.infer<typeof signUpFormSchema>
