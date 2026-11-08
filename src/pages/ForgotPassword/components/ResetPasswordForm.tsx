import { Alert, Link, Stack, TextField } from '@mui/material'
import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink, useNavigate } from 'react-router'
import { AppButton } from '../../../shared/components/AppButton/AppButton'
import { HttpError } from '../../../shared/services/http-client'
import { validateForm, type FieldErrors } from '../../../shared/utils/validate-form'
import { resetPasswordFormSchema } from '../services/reset-password-form-schema'
import { useResetPassword } from '../services/useResetPassword'

export function ResetPasswordForm({ token }: { token: string }) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { trigger, isMutating } = useResetPassword()
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [error, setError] = useState<'invalidLink' | 'unavailable' | null>(null)

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)

    const form = validateForm(resetPasswordFormSchema, { password, confirmation })
    setFieldErrors(form.success ? {} : form.errors)
    if (!form.success) return

    try {
      await trigger({ token, password: form.data.password })
      await navigate('/login', { replace: true, state: { passwordChanged: true } })
    } catch (caught) {
      const code = caught instanceof HttpError ? caught.code : undefined
      if (code === 'weak_password') setFieldErrors({ password: 'resetPassword.weak' })
      else setError(code === 'invalid_reset_link' ? 'invalidLink' : 'unavailable')
    }
  }

  if (error === 'invalidLink') {
    return (
      <Stack spacing={2}>
        <Alert severity="error">{t('resetPassword.invalidLink')}</Alert>
        <Link component={RouterLink} to="/forgot-password">
          {t('resetPassword.requestAnother')}
        </Link>
      </Stack>
    )
  }

  return (
    <Stack component="form" noValidate spacing={2} onSubmit={onSubmit}>
      {error && <Alert severity="error">{t('resetPassword.unavailable')}</Alert>}
      <TextField
        label={t('resetPassword.password')}
        type="password"
        autoComplete="new-password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        error={Boolean(fieldErrors.password)}
        helperText={fieldErrors.password && t(fieldErrors.password)}
      />
      <TextField
        label={t('resetPassword.confirmation')}
        type="password"
        autoComplete="new-password"
        value={confirmation}
        onChange={(event) => setConfirmation(event.target.value)}
        error={Boolean(fieldErrors.confirmation)}
        helperText={fieldErrors.confirmation && t(fieldErrors.confirmation)}
      />
      <AppButton type="submit" loading={isMutating} fullWidth>
        {t('resetPassword.submit')}
      </AppButton>
    </Stack>
  )
}
