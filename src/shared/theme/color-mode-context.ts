import { createContext, useContext } from 'react'
import type { ColorMode } from './theme'

export type ColorModeValue = { mode: ColorMode; setMode: (mode: ColorMode) => void }

export const ColorModeContext = createContext<ColorModeValue>({ mode: 'light', setMode: () => undefined })

export const useColorMode = () => useContext(ColorModeContext)
