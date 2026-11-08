import { Container, Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { LanguageSwitch } from '../../shared/components/LanguageSwitch/LanguageSwitch'
import { ThemeSwitch } from '../../shared/components/ThemeSwitch/ThemeSwitch'
import { useCurrentUser } from '../../shared/services/useCurrentUser'

export function Home() {
  const { t } = useTranslation()
  const { data: user } = useCurrentUser()

  return (
    <Container component="main" sx={{ py: { xs: 3, md: 6 } }}>
      <Stack spacing={2}>
        <Stack direction="row" useFlexGap sx={{ flexWrap: 'wrap', columnGap: 2 }}>
          <LanguageSwitch />
          <ThemeSwitch />
        </Stack>
        <Typography variant="h4" component="h1">
          {t('app.title')}
        </Typography>
        {user && <Typography>{t('home.greeting', { name: user.name })}</Typography>}
      </Stack>
    </Container>
  )
}
