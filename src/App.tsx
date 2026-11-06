import { CssBaseline, ThemeProvider } from '@mui/material'
import { Home } from './pages/Home'
import { AppSwrProvider } from './shared/services/AppSwrProvider'
import { theme } from './shared/theme/theme'

export function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppSwrProvider>
        <Home />
      </AppSwrProvider>
    </ThemeProvider>
  )
}
