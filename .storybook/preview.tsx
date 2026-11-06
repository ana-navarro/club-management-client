import { CssBaseline, ThemeProvider } from '@mui/material'
import type { Preview } from '@storybook/react-vite'
import { theme } from '../src/shared/theme/theme'

const preview: Preview = {
  decorators: [
    (Story) => (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Story />
      </ThemeProvider>
    ),
  ],
}

export default preview
