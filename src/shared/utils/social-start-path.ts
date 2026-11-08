import { toLanguage } from '../i18n/i18n'

export type SocialProvider = 'google' | 'facebook'

// A plain link in the same tab, without pop-ups, so it works on phones too (research R2).
export function socialStartPath(provider: SocialProvider, language: string): string {
  return `/api/auth/${provider}/start?language=${encodeURIComponent(toLanguage(language))}`
}
