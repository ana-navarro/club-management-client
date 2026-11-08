import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'
import { PublicLayout } from '../../shared/components/PublicLayout/PublicLayout'
import { ForgotPasswordForm } from './components/ForgotPasswordForm'
import { ResetPasswordForm } from './components/ResetPasswordForm'

export function ForgotPassword() {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  if (token) {
    return (
      <PublicLayout title={t('resetPassword.title')}>
        <ResetPasswordForm token={token} />
      </PublicLayout>
    )
  }

  return (
    <PublicLayout title={t('forgotPassword.title')}>
      <ForgotPasswordForm />
    </PublicLayout>
  )
}
