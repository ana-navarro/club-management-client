import { CssBaseline, ThemeProvider } from '@mui/material'
import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { ColorModeContext } from './color-mode-context'
import { readStoredColorMode, readSystemColorMode, storeColorMode } from './color-mode-storage'
import { createAppTheme, type ColorMode } from './theme'

export function ColorModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ColorMode>(() => readStoredColorMode() ?? readSystemColorMode())

  const setMode = useCallback((next: ColorMode) => {
    storeColorMode(next)
    setModeState(next)
  }, [])

  const value = useMemo(() => ({ mode, setMode }), [mode, setMode])
  const theme = useMemo(() => createAppTheme(mode), [mode])

  return (
    <ColorModeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  )
}
