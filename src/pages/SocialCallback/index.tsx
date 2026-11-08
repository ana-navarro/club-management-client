import { CircularProgress, Stack, Typography } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { PublicLayout } from '../../shared/components/PublicLayout/PublicLayout'
import { useApplyPreferences } from '../../shared/hooks/usePreferencesSync'
import { saveSession } from '../../shared/services/auth-token'
import { readSessionPreferences } from '../../shared/services/session-preferences'
import { useSocialSession } from './services/useSocialSession'

const readCode = (hash: string): string | null => new URLSearchParams(hash.replace(/^#/, '')).get('code')

// The provider return lands here with a one-time code in the fragment (research R3).
export function SocialCallback() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const applyPreferences = useApplyPreferences()
  const { trigger } = useSocialSession()
  // Read once: the fragment is cleared right away, so it does not stay in the history.
  const [code] = useState(() => readCode(window.location.hash))
  // The code works only once, so StrictMode's second mount must not send it again.
  const sent = useRef(false)

  useEffect(() => {
    if (sent.current) return
    sent.current = true
    window.history.replaceState(window.history.state, '', window.location.pathname)

    if (!code) {
      navigate('/login?social_error=invalid_state', { replace: true })
      return
    }

    trigger({ code, ...readSessionPreferences() })
      .then(({ user, ...session }) => {
        applyPreferences(user.preferences)
        saveSession(session)
        navigate('/', { replace: true })
      })
      .catch(() => navigate('/login?social_error=invalid_state', { replace: true }))
  }, [code, trigger, navigate, applyPreferences])

  return (
    <PublicLayout title={t('login.title')}>
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }} role="status">
        <CircularProgress size={24} aria-hidden />
        <Typography>{t('socialCallback.loading')}</Typography>
      </Stack>
    </PublicLayout>
  )
}
