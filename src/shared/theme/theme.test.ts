import { expect, it } from '@jest/globals'
import { createAppTheme, tokens, type ColorMode } from './theme'

it('builds the light theme from the client palette', () => {
  const { palette } = createAppTheme('light')
  expect(palette.mode).toBe('light')
  expect(palette.background.default).toBe('#F4F7F7')
  expect(palette.background.paper).toBe('#FFFFFF')
  expect(palette.text.primary).toBe('#224248')
  expect(palette.text.secondary).toBe('#325E6A')
  expect(palette.primary.main).toBe('#224248')
  expect(palette.primary.contrastText).toBe('#FFFFFF')
  expect(palette.secondary.main).toBe('#FF9A00')
  expect(palette.secondary.contrastText).toBe('#224248')
})

it('builds the dark theme from the client palette', () => {
  const { palette } = createAppTheme('dark')
  expect(palette.mode).toBe('dark')
  expect(palette.background.default).toBe('#16292D')
  expect(palette.background.paper).toBe('#224248')
  expect(palette.text.primary).toBe('#F4F7F7')
  expect(palette.text.secondary).toBe('#EEF4F4')
  expect(palette.primary.main).toBe('#44A1A4')
  expect(palette.primary.contrastText).toBe('#16292D')
  expect(palette.secondary.main).toBe('#FF9A00')
  expect(palette.secondary.contrastText).toBe('#16292D')
})

const linkColors: [ColorMode, string][] = [
  ['light', '#325E6A'],
  ['dark', '#FF9A00'],
]

it.each(linkColors)('colors links in %s mode', (mode, color) => {
  const links = createAppTheme(mode).components?.MuiLink?.styleOverrides?.root
  expect(links).toEqual({ color })
})

// WCAG 2.1 relative luminance and contrast ratio.
const luminance = (hex: string): number => {
  const channels = [1, 3, 5].map((start) => parseInt(hex.slice(start, start + 2), 16) / 255)
  const [r = 0, g = 0, b = 0] = channels.map((value) =>
    value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4,
  )
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

const contrast = (first: string, second: string): number => {
  const [light, dark] = [luminance(first), luminance(second)].sort((a, b) => b - a)
  return ((light ?? 0) + 0.05) / ((dark ?? 0) + 0.05)
}

const TEXT = 4.5
const COMPONENT = 3

// Every text and component pair of research R15, in both modes (spec FR-019).
const pairs: [ColorMode, string, keyof (typeof tokens)['light'], keyof (typeof tokens)['light'], number][] = []
for (const mode of ['light', 'dark'] satisfies ColorMode[]) {
  for (const background of ['backgroundDefault', 'backgroundPaper'] satisfies (keyof (typeof tokens)['light'])[]) {
    pairs.push([mode, 'primary text', 'textPrimary', background, TEXT])
    pairs.push([mode, 'secondary text', 'textSecondary', background, TEXT])
    pairs.push([mode, 'links', 'link', background, TEXT])
  }
  // Every field and button sits on the paper of PublicLayout, so the focus ring is checked there.
  // On the light page background (#F4F7F7) the teal only reaches 2.8:1, so nothing focusable goes there.
  pairs.push([mode, 'focus and borders', 'focus', 'backgroundPaper', COMPONENT])
  pairs.push([mode, 'primary button text', 'primaryText', 'primary', TEXT])
  pairs.push([mode, 'secondary button text', 'secondaryText', 'secondary', TEXT])
}

it.each(pairs)('has enough contrast in %s mode for %s on %s', (mode, _name, foreground, background, minimum) => {
  expect(contrast(tokens[mode][foreground], tokens[mode][background])).toBeGreaterThanOrEqual(minimum)
})

it('computes the WCAG contrast of known pairs', () => {
  expect(contrast('#FFFFFF', '#000000')).toBeCloseTo(21, 1)
  expect(contrast('#224248', '#FFFFFF')).toBeGreaterThan(10)
})
