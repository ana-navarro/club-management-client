import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './en.json'
import ptBR from './pt-BR.json'

export type Language = 'pt-BR' | 'en'

const STORAGE_KEY = 'language'

export function readStoredLanguage(): Language | null {
  const stored = sessionStorage.getItem(STORAGE_KEY)
  return stored === 'pt-BR' || stored === 'en' ? stored : null
}

export function toLanguage(value: string): Language {
  return value === 'pt-BR' ? 'pt-BR' : 'en'
}

export function detectLanguage(): Language {
  return readStoredLanguage() ?? (navigator.language?.toLowerCase().startsWith('pt') ? 'pt-BR' : 'en')
}

export function changeLanguage(language: Language): void {
  sessionStorage.setItem(STORAGE_KEY, language)
  void i18next.changeLanguage(language)
}

void i18next.use(initReactI18next).init({
  resources: { 'pt-BR': { translation: ptBR }, en: { translation: en } },
  lng: detectLanguage(),
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

export { i18next }
