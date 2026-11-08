import { createTheme, type Theme } from '@mui/material/styles'

export type ColorMode = 'light' | 'dark'

// Client palette (spec FR-016). Neutral backgrounds derive from the darkest color (research R15).
export const palette = {
  deep: '#224248',
  slate: '#325E6A',
  teal: '#44A1A4',
  orange: '#FF9A00',
  white: '#FFFFFF',
  mist: '#F4F7F7',
  mistSoft: '#EEF4F4',
  night: '#16292D',
}

// Light and dark tokens. Each text and component pair is checked for contrast in theme.test.ts.
export const tokens = {
  light: {
    backgroundDefault: palette.mist,
    backgroundPaper: palette.white,
    textPrimary: palette.deep,
    textSecondary: palette.slate,
    primary: palette.deep,
    primaryText: palette.white,
    secondary: palette.orange,
    secondaryText: palette.deep,
    link: palette.slate,
    focus: palette.teal,
  },
  dark: {
    backgroundDefault: palette.night,
    backgroundPaper: palette.deep,
    textPrimary: palette.mist,
    textSecondary: palette.mistSoft,
    primary: palette.teal,
    primaryText: palette.night,
    secondary: palette.orange,
    secondaryText: palette.night,
    link: palette.orange,
    focus: palette.teal,
  },
} satisfies Record<ColorMode, Record<string, string>>

export function createAppTheme(mode: ColorMode): Theme {
  const colors = tokens[mode]
  return createTheme({
    palette: {
      mode,
      primary: { main: colors.primary, contrastText: colors.primaryText },
      secondary: { main: colors.secondary, contrastText: colors.secondaryText },
      background: { default: colors.backgroundDefault, paper: colors.backgroundPaper },
      text: { primary: colors.textPrimary, secondary: colors.textSecondary },
    },
    components: {
      MuiLink: {
        defaultProps: { underline: 'always' },
        styleOverrides: { root: { color: colors.link } },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: { '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: colors.focus } },
        },
      },
      MuiButtonBase: {
        styleOverrides: {
          root: { '&.Mui-focusVisible': { outline: `2px solid ${colors.focus}`, outlineOffset: 2 } },
        },
      },
    },
  })
}
