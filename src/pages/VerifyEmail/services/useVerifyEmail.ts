import useSWRImmutable from 'swr/immutable'
import { postWithoutResponse } from '../../../shared/services/http-client'

const PATH = '/auth/verify-email'

// Keyed by the token and never revalidated, so the link is sent once per token,
// even when StrictMode mounts the page twice.
export function useVerifyEmail(token: string | null) {
  return useSWRImmutable(
    token ? [PATH, token] : null,
    ([path, value]: [string, string]) => postWithoutResponse(path, { token: value }).then(() => true),
    { shouldRetryOnError: false },
  )
}
