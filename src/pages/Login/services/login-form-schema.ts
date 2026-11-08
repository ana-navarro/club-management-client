import { z } from 'zod'
import { emailField, passwordField } from '../../../shared/utils/validate-form'

export const loginFormSchema = z.object({ email: emailField, password: passwordField })
