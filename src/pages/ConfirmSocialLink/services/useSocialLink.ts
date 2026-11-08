import useSWRImmutable from 'swr/immutable'
import useSWRMutation from 'swr/mutation'
import { z } from 'zod'
import { postJson, postWithoutResponse } from '../../../shared/services/http-client'

const previewSchema = z.object({
  provider: z.enum(['google', 'facebook']),
  profileName: z.string(),
  email: z.string(),
})

export type SocialLinkPreview = z.infer<typeof previewSchema>

const PREVIEW_PATH = '/auth/social/link/preview'

// A read, so it uses SWR (constitution). Keyed by the token and never revalidated: opening the page
// only shows the request, it never confirms it (research R5a).
export function useSocialLinkPreview(token: string | null) {
  return useSWRImmutable(
    token ? [PREVIEW_PATH, token] : null,
    ([path, value]: [string, string]) => postJson(path, previewSchema, { token: value }),
    { shouldRetryOnError: false },
  )
}

export function useConfirmSocialLink() {
  return useSWRMutation('/auth/social/link/confirm', (key: string, { arg }: { arg: { token: string } }) =>
    postWithoutResponse(key, arg),
  )
}

export function useDeclineSocialLink() {
  return useSWRMutation('/auth/social/link/decline', (key: string, { arg }: { arg: { token: string } }) =>
    postWithoutResponse(key, arg),
  )
}
