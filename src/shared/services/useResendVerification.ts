import useSWRMutation from 'swr/mutation'
import { postWithoutResponse } from './http-client'

export type ResendVerificationRequest = { email: string; language: string }

// Used by the login, the sign-up and the email confirmation pages.
export function useResendVerification() {
  return useSWRMutation('/auth/resend-verification', (key: string, { arg }: { arg: ResendVerificationRequest }) =>
    postWithoutResponse(key, arg),
  )
}
