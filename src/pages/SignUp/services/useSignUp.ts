import useSWRMutation from 'swr/mutation'
import { postWithoutResponse } from '../../../shared/services/http-client'

export type SignUpRequest = { name: string; email: string; password: string; language: string }

export function useSignUp() {
  return useSWRMutation('/auth/register', (key: string, { arg }: { arg: SignUpRequest }) =>
    postWithoutResponse(key, arg),
  )
}
