import { FormControlLabel, Switch } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { changeLanguage } from '../../i18n/i18n'

export function LanguageSwitch() {
  const { t, i18n } = useTranslation()

  return (
    <FormControlLabel
      label={t('preferences.language')}
      control={
        <Switch
          checked={i18n.language === 'en'}
          onChange={(event) => changeLanguage(event.target.checked ? 'en' : 'pt-BR')}
          slotProps={{ input: { 'aria-label': t('preferences.languageLabel') } }}
        />
      }
    />
  )
}
