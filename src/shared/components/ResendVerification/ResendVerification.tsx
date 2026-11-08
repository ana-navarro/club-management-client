import { Alert, Stack, TextField, Typography } from '@mui/material'
import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { resendVerificationFormSchema } from '../../services/resend-verification-form-schema'
import { useResendVerification } from '../../services/useResendVerification'
import { validateForm } from '../../utils/validate-form'
import { AppButton } from '../AppButton/AppButton'

// With a known email, only the button. Without one, the email field too.
export function ResendVerification({ email }: { email?: string }) {
  const { t, i18n } = useTranslation()
  const { trigger, isMutating } = useResendVerification()
  const [value, setValue] = useState(email ?? '')
  const [fieldError, setFieldError] = useState<string | null>(null)
  const [status, setStatus] = useState<'idle' | 'sent' | 'failed'>('idle')

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setStatus('idle')
    const form = validateForm(resendVerificationFormSchema, { email: value })
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
      {status === 'sent' && <Alert severity="success">{t('resendVerification.sent')}</Alert>}
      {status === 'failed' && <Alert severity="error">{t('resendVerification.unavailable')}</Alert>}
      {email === undefined && (
        <>
          <Typography>{t('resendVerification.description')}</Typography>
          <TextField
            label={t('login.email')}
            type="email"
            autoComplete="username"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            error={Boolean(fieldError)}
            helperText={fieldError && t(fieldError)}
          />
        </>
      )}
      <AppButton type="submit" variant="outlined" loading={isMutating} fullWidth>
        {t('resendVerification.submit')}
      </AppButton>
    </Stack>
  )
}
