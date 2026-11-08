import type { ColorMode } from './theme'

const STORAGE_KEY = 'theme'

export function readStoredColorMode(): ColorMode | null {
  const stored = sessionStorage.getItem(STORAGE_KEY)
  return stored === 'light' || stored === 'dark' ? stored : null
}

export function storeColorMode(mode: ColorMode): void {
  sessionStorage.setItem(STORAGE_KEY, mode)
}

export function readSystemColorMode(): ColorMode {
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}
