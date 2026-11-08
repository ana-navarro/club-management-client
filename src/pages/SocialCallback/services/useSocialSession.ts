import useSWRMutation from 'swr/mutation'
import { storedSessionSchema } from '../../../shared/services/auth-token'
import { postJson } from '../../../shared/services/http-client'
import { userSchema, type Preferences } from '../../../shared/services/user-types'

const sessionResponseSchema = storedSessionSchema.extend({ user: userSchema })

export type SocialSessionRequest = { code: string } & Partial<Preferences>

// Trades the one-time code from the provider return for the same session as the password login.
export function useSocialSession() {
  return useSWRMutation('/auth/social/session', (key: string, { arg }: { arg: SocialSessionRequest }) =>
    postJson(key, sessionResponseSchema, arg),
  )
}
