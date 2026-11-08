import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { changeLanguage, toLanguage } from '../i18n/i18n'
import type { Preferences } from '../services/user-types'
import { useUpdatePreferences } from '../services/useUpdatePreferences'
import { useColorMode } from '../theme/color-mode-context'

// Applies the choices the backend returned at login.
export function useApplyPreferences() {
  const { setMode } = useColorMode()
  return (preferences: Preferences) => {
    if (preferences.theme) setMode(preferences.theme)
    if (preferences.language) changeLanguage(preferences.language)
  }
}

// While signed in, saves each change of theme or language on the user.
export function usePreferencesSync(): void {
  const { mode } = useColorMode()
  const { i18n } = useTranslation()
  const language = toLanguage(i18n.language)
  const { trigger } = useUpdatePreferences()
  const saved = useRef({ mode, language })

  useEffect(() => {
    const changes: Partial<Preferences> = {}
    if (mode !== saved.current.mode) changes.theme = mode
    if (language !== saved.current.language) changes.language = language
    saved.current = { mode, language }
    if (Object.keys(changes).length > 0) {
      // Failing to save a preference must not interrupt the user.
      trigger(changes).catch(() => undefined)
    }
  }, [mode, language, trigger])
}
