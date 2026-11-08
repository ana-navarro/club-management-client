import { z, type ZodType } from 'zod'

const MAXIMUM_EMAIL_LENGTH = 254
const MAXIMUM_PASSWORD_LENGTH = 256

// Messages are translation keys, so the same schema works in both languages.
export const emailField = z
  .string()
  .trim()
  .min(1, 'validation.required')
  .max(MAXIMUM_EMAIL_LENGTH, 'validation.email')
  .pipe(z.email('validation.email'))

export const passwordField = z
  .string()
  .min(1, 'validation.required')
  .max(MAXIMUM_PASSWORD_LENGTH, 'validation.tooLong')

export type FieldErrors = Record<string, string>

export type FormResult<T> = { success: true; data: T } | { success: false; errors: FieldErrors }

// Validates a form before it is sent, keeping the first message of each field.
export function validateForm<T>(schema: ZodType<T>, values: object): FormResult<T> {
  const result = schema.safeParse(values)
  if (result.success) return { success: true, data: result.data }

  const errors: FieldErrors = {}
  for (const issue of result.error.issues) {
    const field = String(issue.path[0])
    errors[field] ??= issue.message
  }
  return { success: false, errors }
}
