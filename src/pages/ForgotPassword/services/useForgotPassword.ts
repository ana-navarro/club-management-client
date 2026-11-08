import useSWRMutation from 'swr/mutation'
import { postWithoutResponse } from '../../../shared/services/http-client'

export function useForgotPassword() {
  return useSWRMutation(
    '/auth/forgot-password',
    (key: string, { arg }: { arg: { email: string; language: string } }) => postWithoutResponse(key, arg),
  )
}
