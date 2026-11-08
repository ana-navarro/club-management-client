import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'
import { PublicLayout } from '../../shared/components/PublicLayout/PublicLayout'
import { HttpError } from '../../shared/services/http-client'
import { VerifyEmailResult, type VerifyEmailState } from './components/VerifyEmailResult'
import { useVerifyEmail } from './services/useVerifyEmail'

const toState = (token: string | null, data: boolean | undefined, error: Error | undefined): VerifyEmailState => {
  if (!token) return 'invalid'
  if (data) return 'confirmed'
  if (!error) return 'loading'
  return error instanceof HttpError && error.status === 400 ? 'invalid' : 'unavailable'
}

export function VerifyEmail() {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const { data, error } = useVerifyEmail(token)

  return (
    <PublicLayout title={t('verifyEmail.title')}>
      <VerifyEmailResult state={toState(token, data, error instanceof Error ? error : undefined)} />
    </PublicLayout>
  )
}
