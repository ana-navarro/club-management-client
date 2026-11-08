import { Alert, Link, Stack, TextField, Typography } from '@mui/material'
import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router'
import { AppButton } from '../../../shared/components/AppButton/AppButton'
import { validateForm } from '../../../shared/utils/validate-form'
import { forgotPasswordFormSchema } from '../services/forgot-password-form-schema'
import { useForgotPassword } from '../services/useForgotPassword'

export function ForgotPasswordForm() {
  const { t, i18n } = useTranslation()
  const { trigger, isMutating } = useForgotPassword()
  const [email, setEmail] = useState('')
  const [fieldError, setFieldError] = useState<string | null>(null)
  const [status, setStatus] = useState<'idle' | 'sent' | 'failed'>('idle')

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setStatus('idle')
    const form = validateForm(forgotPasswordFormSchema, { email })
    setFieldError(form.success ? null : (form.errors.email ?? null))
    if (!form.success) return

    try {
      await trigger({ ...form.data, language: i18n.language })
      setStatus('sent')
    } catch {
      setStatus('failed')
    }
  }

  return (
    <Stack component="form" noValidate spacing={2} onSubmit={onSubmit}>
      <Typography>{t('forgotPassword.description')}</Typography>
      {status === 'sent' && <Alert severity="success">{t('forgotPassword.sent')}</Alert>}
      {status === 'failed' && <Alert severity="error">{t('forgotPassword.unavailable')}</Alert>}
      <TextField
        label={t('login.email')}
        type="email"
        autoComplete="username"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        error={Boolean(fieldError)}
        helperText={fieldError && t(fieldError)}
      />
      <AppButton type="submit" loading={isMutating} fullWidth>
        {t('forgotPassword.submit')}
      </AppButton>
      <Link component={RouterLink} to="/login">
        {t('forgotPassword.backToLogin')}
      </Link>
    </Stack>
  )
}
