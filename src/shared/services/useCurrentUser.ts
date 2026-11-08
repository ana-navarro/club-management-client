import useSWR from 'swr'
import { getJson } from './http-client'
import { userSchema } from './user-types'

export function useCurrentUser() {
  return useSWR('/users/me', (path: string) => getJson(path, userSchema))
}
