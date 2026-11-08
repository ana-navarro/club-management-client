import { Alert, Link, Stack, TextField } from '@mui/material'
import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router'
import { AppButton } from '../../../shared/components/AppButton/AppButton'
import { saveSession } from '../../../shared/services/auth-token'
import { HttpError } from '../../../shared/services/http-client'
import { useApplyPreferences } from '../../../shared/hooks/usePreferencesSync'
import { readSessionPreferences } from '../../../shared/services/session-preferences'
import { validateForm, type FieldErrors } from '../../../shared/utils/validate-form'
import { loginFormSchema } from '../services/login-form-schema'
import { useLogin } from '../services/useLogin'

export function LoginForm({ onEmailNotVerified }: { onEmailNotVerified?: (email: string) => void }) {
  const { t } = useTranslation()
  const { trigger, isMutating } = useLogin()
  const applyPreferences = useApplyPreferences()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    const form = validateForm(loginFormSchema, { email, password })
    setFieldErrors(form.success ? {} : form.errors)
    if (!form.success) return

    try {
      const { user, ...session } = await trigger({ ...form.data, preferences: readSessionPreferences() })
      applyPreferences(user.preferences)
      saveSession(session)
    } catch (caught) {
      if (caught instanceof HttpError && caught.code === 'email_not_verified') {
        onEmailNotVerified?.(form.data.email)
        return
      }
      const invalid = caught instanceof HttpError && caught.status === 401
      setError(invalid ? 'login.invalidCredentials' : 'login.unavailable')
    }
  }

  return (
    <Stack component="form" noValidate spacing={2} onSubmit={onSubmit}>
      {error && <Alert severity="error">{t(error)}</Alert>}
      <TextField
        label={t('login.email')}
        type="email"
        autoComplete="username"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        error={Boolean(fieldErrors.email)}
        helperText={fieldErrors.email && t(fieldErrors.email)}
      />
      <TextField
        label={t('login.password')}
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        error={Boolean(fieldErrors.password)}
        helperText={fieldErrors.password && t(fieldErrors.password)}
      />
      <AppButton type="submit" loading={isMutating} fullWidth>
        {t('login.submit')}
      </AppButton>
      <Link component={RouterLink} to="/forgot-password">
        {t('login.forgotPassword')}
      </Link>
    </Stack>
  )
}
