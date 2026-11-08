import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'
import { PublicLayout } from '../../shared/components/PublicLayout/PublicLayout'
import { HttpError } from '../../shared/services/http-client'
import { SocialLinkResult, type SocialLinkState } from './components/SocialLinkResult'
import { useConfirmSocialLink, useDeclineSocialLink, useSocialLinkPreview } from './services/useSocialLink'

type Outcome = 'confirmed' | 'declined' | 'invalid' | 'failed' | null

const isInvalidLink = (error: Error | undefined) => error instanceof HttpError && error.status === 400

// The page of the link that the first Facebook entry sends by email (spec FR-014c).
export function ConfirmSocialLink() {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const preview = useSocialLinkPreview(token)
  const confirm = useConfirmSocialLink()
  const decline = useDeclineSocialLink()
  const [outcome, setOutcome] = useState<Outcome>(null)

  const run = async (action: 'confirm' | 'decline') => {
    if (!token) return
    setOutcome(null)
    try {
      if (action === 'confirm') await confirm.trigger({ token })
      else await decline.trigger({ token })
      setOutcome(action === 'confirm' ? 'confirmed' : 'declined')
    } catch (caught) {
      setOutcome(caught instanceof Error && isInvalidLink(caught) ? 'invalid' : 'failed')
    }
  }

  const toState = (): SocialLinkState => {
    if (!token || outcome === 'invalid') return { status: 'invalid' }
    if (outcome === 'confirmed' || outcome === 'declined') return { status: outcome }
    const error = preview.error instanceof Error ? preview.error : undefined
    if (error) return { status: isInvalidLink(error) ? 'invalid' : 'unavailable' }
    if (!preview.data) return { status: 'loading' }
    const sending = confirm.isMutating ? 'confirm' : decline.isMutating ? 'decline' : null
    return { status: 'ready', preview: preview.data, sending, failed: outcome === 'failed' }
  }

  return (
    <PublicLayout title={t('confirmSocialLink.title')}>
      <SocialLinkResult state={toState()} onConfirm={() => run('confirm')} onDecline={() => run('decline')} />
    </PublicLayout>
  )
}
