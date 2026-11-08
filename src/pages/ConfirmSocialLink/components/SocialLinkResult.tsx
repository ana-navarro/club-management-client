import { Alert, Button, CircularProgress, Link, Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router'
import { SocialLoginButtons } from '../../../shared/components/SocialLoginButtons/SocialLoginButtons'
import { AppButton } from '../../../shared/components/AppButton/AppButton'
import type { SocialLinkPreview } from '../services/useSocialLink'

export type SocialLinkState =
  | { status: 'loading' }
  | { status: 'ready'; preview: SocialLinkPreview; sending: 'confirm' | 'decline' | null; failed: boolean }
  | { status: 'confirmed' | 'declined' | 'invalid' | 'unavailable' }

export type SocialLinkActions = { onConfirm: () => void; onDecline: () => void }

const LoginLink = () => {
  const { t } = useTranslation()
  return (
    <Link component={RouterLink} to="/login">
      {t('confirmSocialLink.goToLogin')}
    </Link>
  )
}

export function SocialLinkResult({ state, onConfirm, onDecline }: { state: SocialLinkState } & SocialLinkActions) {
  const { t } = useTranslation()

  switch (state.status) {
    case 'loading':
      return (
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }} role="status">
          <CircularProgress size={24} aria-hidden />
          <Typography>{t('confirmSocialLink.loading')}</Typography>
        </Stack>
      )
    case 'ready':
      return (
        <Stack spacing={2}>
          <Typography sx={{ overflowWrap: 'anywhere' }}>
            {t('confirmSocialLink.question', { profileName: state.preview.profileName, email: state.preview.email })}
          </Typography>
          <Alert severity="warning">{t('confirmSocialLink.warning')}</Alert>
          {state.failed && <Alert severity="error">{t('confirmSocialLink.unavailable')}</Alert>}
          <AppButton
            onClick={onConfirm}
            loading={state.sending === 'confirm'}
            disabled={state.sending !== null}
            fullWidth
          >
            {t('confirmSocialLink.confirm')}
          </AppButton>
          <Button onClick={onDecline} disabled={state.sending !== null} variant="outlined" fullWidth>
            {t('confirmSocialLink.decline')}
          </Button>
        </Stack>
      )
    case 'confirmed':
      return (
        <Stack spacing={2}>
          <Alert severity="success">{t('confirmSocialLink.confirmed')}</Alert>
          <SocialLoginButtons providers={['facebook']} />
          <LoginLink />
        </Stack>
      )
    case 'declined':
      return (
        <Stack spacing={2}>
          <Alert severity="info">{t('confirmSocialLink.declined')}</Alert>
          <LoginLink />
        </Stack>
      )
    case 'invalid':
      return (
        <Stack spacing={2}>
          <Alert severity="error">{t('confirmSocialLink.invalidLink')}</Alert>
          <SocialLoginButtons providers={['facebook']} />
          <LoginLink />
        </Stack>
      )
    default:
      return (
        <Stack spacing={2}>
          <Alert severity="error">{t('confirmSocialLink.unavailable')}</Alert>
          <LoginLink />
        </Stack>
      )
  }
}
