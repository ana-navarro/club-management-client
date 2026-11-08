import { readStoredLanguage } from '../i18n/i18n'
import { readStoredColorMode } from '../theme/color-mode-storage'
import type { Preferences } from './user-types'

// The theme and language chosen in this session, sent at sign-in so the user keeps them.
// Used by the password login and by the social login return.
export function readSessionPreferences(): Partial<Preferences> {
  const theme = readStoredColorMode()
  const language = readStoredLanguage()
  return { ...(theme && { theme }), ...(language && { language }) }
}
