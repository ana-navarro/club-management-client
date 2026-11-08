import { Alert, Link, Stack } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router'
import { ResendVerification } from '../../../shared/components/ResendVerification/ResendVerification'

// The same notice for any accepted sign-up, so it never reveals whether the email had an account.
export function CheckEmailNotice({ email }: { email: string }) {
  const { t } = useTranslation()

  return (
    <Stack spacing={2}>
      <Alert severity="success">{t('checkEmail.description', { email })}</Alert>
      <ResendVerification email={email} />
      <Link component={RouterLink} to="/login">
        {t('forgotPassword.backToLogin')}
      </Link>
    </Stack>
  )
}
