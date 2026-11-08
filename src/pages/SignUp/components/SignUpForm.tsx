import { Alert, Link, Stack, TextField } from '@mui/material'
import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router'
import { AppButton } from '../../../shared/components/AppButton/AppButton'
import { HttpError } from '../../../shared/services/http-client'
import { validateForm, type FieldErrors } from '../../../shared/utils/validate-form'
import { signUpFormSchema } from '../services/sign-up-form-schema'
import { useSignUp } from '../services/useSignUp'

const FIELDS = [
  { name: 'name', label: 'signUp.name', type: 'text', autoComplete: 'name' },
  { name: 'email', label: 'login.email', type: 'email', autoComplete: 'email' },
  { name: 'password', label: 'signUp.password', type: 'password', autoComplete: 'new-password' },
  { name: 'confirmation', label: 'signUp.confirmation', type: 'password', autoComplete: 'new-password' },
]

const toErrorKey = (caught: Error): string => {
  if (caught instanceof HttpError && caught.status === 429) return 'signUp.tooMany'
  if (caught instanceof HttpError && caught.code === 'weak_password') return 'resetPassword.weak'
  return 'signUp.unavailable'
}

export function SignUpForm({ onSent }: { onSent: (email: string) => void }) {
  const { t, i18n } = useTranslation()
  const { trigger, isMutating } = useSignUp()
  const [values, setValues] = useState<Record<string, string>>({ name: '', email: '', password: '', confirmation: '' })
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    // The button is disabled while sending, but a fast double submit still sends once.
    if (isMutating) return
    setError(null)
    const form = validateForm(signUpFormSchema, values)
    setFieldErrors(form.success ? {} : form.errors)
    if (!form.success) return

    const { name, email, password } = form.data
    try {
      await trigger({ name, email, password, language: i18n.language })
      onSent(email)
    } catch (caught) {
      setError(caught instanceof Error ? toErrorKey(caught) : 'signUp.unavailable')
    }
  }

  return (
    <Stack component="form" noValidate spacing={2} onSubmit={onSubmit}>
      {error && <Alert severity="error">{t(error)}</Alert>}
      {FIELDS.map((field) => (
        <TextField
          key={field.name}
          label={t(field.label)}
          type={field.type}
          autoComplete={field.autoComplete}
          value={values[field.name] ?? ''}
          onChange={(event) => setValues((current) => ({ ...current, [field.name]: event.target.value }))}
          error={Boolean(fieldErrors[field.name])}
          helperText={fieldErrors[field.name] && t(fieldErrors[field.name] ?? '')}
        />
      ))}
      <AppButton type="submit" loading={isMutating} fullWidth>
        {t('signUp.submit')}
      </AppButton>
      <Link component={RouterLink} to="/login">
        {t('signUp.haveAccount')}
      </Link>
    </Stack>
  )
}
