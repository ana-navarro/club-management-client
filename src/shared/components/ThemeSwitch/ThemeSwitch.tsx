import { FormControlLabel, Switch } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useColorMode } from '../../theme/color-mode-context'

export function ThemeSwitch() {
  const { t } = useTranslation()
  const { mode, setMode } = useColorMode()

  return (
    <FormControlLabel
      label={t('preferences.darkTheme')}
      control={
        <Switch checked={mode === 'dark'} onChange={(event) => setMode(event.target.checked ? 'dark' : 'light')} />
      }
    />
  )
}
