import useSWRMutation from 'swr/mutation'
import { storedSessionSchema } from '../../../shared/services/auth-token'
import { postJson } from '../../../shared/services/http-client'
import { userSchema, type Preferences } from '../../../shared/services/user-types'

const loginResponseSchema = storedSessionSchema.extend({ user: userSchema })

export type LoginRequest = { email: string; password: string; preferences: Partial<Preferences> }

export function useLogin() {
  return useSWRMutation('/auth/login', (key: string, { arg }: { arg: LoginRequest }) =>
    postJson(key, loginResponseSchema, arg),
  )
}
