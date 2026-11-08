import useSWRMutation from 'swr/mutation'
import { postWithoutResponse } from '../../../shared/services/http-client'

export function useResetPassword() {
  return useSWRMutation(
    '/auth/reset-password',
    (key: string, { arg }: { arg: { token: string; password: string } }) => postWithoutResponse(key, arg),
  )
}
