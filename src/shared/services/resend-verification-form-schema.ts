import { z } from 'zod'
import { emailField } from '../utils/validate-form'

export const resendVerificationFormSchema = z.object({ email: emailField })
