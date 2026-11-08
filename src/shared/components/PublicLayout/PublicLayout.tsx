import { Box, Paper, Stack, Typography } from '@mui/material'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { LanguageSwitch } from '../LanguageSwitch/LanguageSwitch'
import { ThemeSwitch } from '../ThemeSwitch/ThemeSwitch'

export function PublicLayout({ title, children }: { title: string; children: ReactNode }) {
  const { t } = useTranslation()

  return (
    <Box
      component="main"
      sx={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: { xs: 'flex-start', sm: 'center' },
        p: { xs: 2, sm: 3 },
      }}
    >
      <Paper sx={{ width: '100%', maxWidth: 440, p: { xs: 2.5, sm: 4 } }}>
        <Stack spacing={2.5}>
          <Stack
            direction="row"
            useFlexGap
            sx={{ flexWrap: 'wrap', justifyContent: 'space-between', columnGap: 1 }}
          >
            <LanguageSwitch />
            <ThemeSwitch />
          </Stack>
          <Typography variant="body2" component="p">
            {t('app.title')}
          </Typography>
          <Typography variant="h4" component="h1">
            {title}
          </Typography>
          {children}
        </Stack>
      </Paper>
    </Box>
  )
}
