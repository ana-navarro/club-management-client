import { z } from 'zod'
import { emailField } from '../../../shared/utils/validate-form'

export const forgotPasswordFormSchema = z.object({ email: emailField })
