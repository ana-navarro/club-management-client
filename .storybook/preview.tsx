import type { Preview } from '@storybook/react-vite'
import { useEffect } from 'react'
import { changeLanguage, type Language } from '../src/shared/i18n/i18n'
import { useColorMode } from '../src/shared/theme/color-mode-context'
import { ColorModeProvider } from '../src/shared/theme/ColorModeProvider'
import type { ColorMode } from '../src/shared/theme/theme'

function ApplyGlobals({ theme, language }: { theme: ColorMode; language: Language }) {
  const { setMode } = useColorMode()
  useEffect(() => setMode(theme), [theme, setMode])
  useEffect(() => changeLanguage(language), [language])
  return null
}

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Theme',
      toolbar: { title: 'Theme', items: ['light', 'dark'], dynamicTitle: true },
    },
    language: {
      description: 'Language',
      toolbar: { title: 'Language', items: ['pt-BR', 'en'], dynamicTitle: true },
    },
  },
  initialGlobals: { theme: 'light', language: 'pt-BR' },
  decorators: [
    (Story, context) => (
      <ColorModeProvider>
        <ApplyGlobals theme={context.globals.theme} language={context.globals.language} />
        <Story />
      </ColorModeProvider>
    ),
  ],
}

export default preview
