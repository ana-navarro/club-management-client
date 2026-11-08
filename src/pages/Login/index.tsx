import { Alert, Button, Divider, Stack, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink, useLocation, useSearchParams } from 'react-router'
import { z } from 'zod'
import { PublicLayout } from '../../shared/components/PublicLayout/PublicLayout'
import { ResendVerification } from '../../shared/components/ResendVerification/ResendVerification'
import { SocialLoginButtons } from '../../shared/components/SocialLoginButtons/SocialLoginButtons'
import { clearSessionNotice, readSessionNotice } from '../../shared/services/auth-token'
import { LoginForm } from './components/LoginForm'

const locationStateSchema = z.object({ passwordChanged: z.boolean() })

const SOCIAL_ERRORS = ['cancelled', 'email_required', 'invalid_credentials', 'provider_unavailable', 'invalid_state']

// The provider return only brings a code, so unknown values are ignored.
const readSocialMessage = (params: URLSearchParams): { severity: 'error' | 'info'; key: string } | null => {
  const error = params.get('social_error')
  if (error) {
    return { severity: 'error', key: `social.errors.${SOCIAL_ERRORS.includes(error) ? error : 'provider_unavailable'}` }
  }
  return params.get('social_notice') === 'check_email' ? { severity: 'info', key: 'social.checkEmail' } : null
}

export function Login() {
  const { t } = useTranslation()
  const location = useLocation()
  const state = locationStateSchema.safeParse(location.state)
  const passwordChanged = state.success && state.data.passwordChanged
  const [expired] = useState(() => readSessionNotice() === 'expired')
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null)
  const [searchParams, setSearchParams] = useSearchParams()
  const [socialMessage] = useState(() => readSocialMessage(searchParams))

  useEffect(() => clearSessionNotice(), [])

  // The message stays on screen, but the code leaves the URL, so a reload does not show it again.
  useEffect(() => {
    if (searchParams.has('social_error') || searchParams.has('social_notice')) {
      setSearchParams({}, { replace: true, state: location.state })
    }
  }, [searchParams, setSearchParams, location.state])

  return (
    <PublicLayout title={t('login.title')}>
      {expired && <Alert severity="info">{t('login.sessionExpired')}</Alert>}
      {passwordChanged && <Alert severity="success">{t('resetPassword.success')}</Alert>}
      {socialMessage && <Alert severity={socialMessage.severity}>{t(socialMessage.key)}</Alert>}
      {unverifiedEmail && (
        <Stack spacing={2}>
          <Alert severity="warning">{t('login.emailNotVerified')}</Alert>
          <ResendVerification key={unverifiedEmail} email={unverifiedEmail} />
        </Stack>
      )}
      <LoginForm onEmailNotVerified={setUnverifiedEmail} />
      <Divider>{t('social.or')}</Divider>
      <SocialLoginButtons />
      <Divider />
      <Stack spacing={1}>
        <Typography variant="body2">{t('login.noAccount')}</Typography>
        <Button component={RouterLink} to="/signup" variant="contained" color="secondary" fullWidth>
          {t('login.signUp')}
        </Button>
      </Stack>
    </PublicLayout>
  )
}
