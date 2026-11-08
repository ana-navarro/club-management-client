import useSWRMutation from 'swr/mutation'
import { patchJson } from './http-client'
import { userSchema, type Preferences } from './user-types'

export function useUpdatePreferences() {
  return useSWRMutation('/users/me', (_key: string, { arg }: { arg: Partial<Preferences> }) =>
    patchJson('/users/me/preferences', userSchema, arg),
  )
}
