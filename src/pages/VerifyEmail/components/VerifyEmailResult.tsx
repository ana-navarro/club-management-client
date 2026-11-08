import { Alert, Button, CircularProgress, Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router'
import { ResendVerification } from '../../../shared/components/ResendVerification/ResendVerification'

export type VerifyEmailState = 'loading' | 'confirmed' | 'invalid' | 'unavailable'

export function VerifyEmailResult({ state }: { state: VerifyEmailState }) {
  const { t } = useTranslation()

  if (state === 'loading') {
    return (
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }} role="status">
        <CircularProgress size={24} aria-hidden />
        <Typography>{t('verifyEmail.loading')}</Typography>
      </Stack>
    )
  }

  if (state === 'confirmed') {
    return (
      <Stack spacing={2}>
        <Alert severity="success">{t('verifyEmail.success')}</Alert>
        <Button component={RouterLink} to="/login" variant="contained" fullWidth>
          {t('verifyEmail.goToLogin')}
        </Button>
      </Stack>
    )
  }

  return (
    <Stack spacing={2}>
      <Alert severity="error">{t(state === 'invalid' ? 'verifyEmail.invalidLink' : 'verifyEmail.unavailable')}</Alert>
      <ResendVerification />
    </Stack>
  )
}
