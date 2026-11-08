import { Button, Stack } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { socialStartPath, type SocialProvider } from '../../utils/social-start-path'
import { FacebookLogo } from './FacebookLogo'
import { GoogleLogo } from './GoogleLogo'

const LOGOS = { google: GoogleLogo, facebook: FacebookLogo }

// Outlined buttons with the brand logos and the theme text color, for contrast in both themes (R16).
// Used by the login page and by the Facebook confirmation page.
export function SocialLoginButtons({ providers = ['google', 'facebook'] }: { providers?: SocialProvider[] }) {
  const { t, i18n } = useTranslation()

  return (
    <Stack spacing={1.5}>
      {providers.map((provider) => {
        const Logo = LOGOS[provider]
        return (
          <Button
            key={provider}
            href={socialStartPath(provider, i18n.language)}
            variant="outlined"
            color="inherit"
            fullWidth
            startIcon={<Logo />}
            sx={{ bgcolor: 'background.paper', color: 'text.primary', borderColor: 'divider', py: 1 }}
          >
            {t(`social.${provider}`)}
          </Button>
        )
      })}
    </Stack>
  )
}
