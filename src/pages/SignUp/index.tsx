import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PublicLayout } from '../../shared/components/PublicLayout/PublicLayout'
import { CheckEmailNotice } from './components/CheckEmailNotice'
import { SignUpForm } from './components/SignUpForm'

export function SignUp() {
  const { t } = useTranslation()
  const [sentTo, setSentTo] = useState<string | null>(null)

  if (sentTo) {
    return (
      <PublicLayout title={t('checkEmail.title')}>
        <CheckEmailNotice email={sentTo} />
      </PublicLayout>
    )
  }

  return (
    <PublicLayout title={t('signUp.title')}>
      <SignUpForm onSent={setSentTo} />
    </PublicLayout>
  )
}
