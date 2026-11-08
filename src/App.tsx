import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import { ConfirmSocialLink } from './pages/ConfirmSocialLink'
import { ForgotPassword } from './pages/ForgotPassword'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { SignUp } from './pages/SignUp'
import { SocialCallback } from './pages/SocialCallback'
import { VerifyEmail } from './pages/VerifyEmail'
import { PublicOnly, RequireAuth } from './shared/components/RouteGuards/RouteGuards'
import { AppSwrProvider } from './shared/services/AppSwrProvider'
import { ColorModeProvider } from './shared/theme/ColorModeProvider'

export function App() {
  return (
    <ColorModeProvider>
      <AppSwrProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<PublicOnly />}>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
            </Route>
            {/* Public with or without a session: links from emails and the provider return. */}
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/confirm-social-link" element={<ConfirmSocialLink />} />
            <Route path="/auth/callback" element={<SocialCallback />} />
            <Route element={<RequireAuth />}>
              <Route path="/" element={<Home />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AppSwrProvider>
    </ColorModeProvider>
  )
}
