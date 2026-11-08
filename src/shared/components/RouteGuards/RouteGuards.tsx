import { Navigate, Outlet } from 'react-router'
import { useSessionRenewal } from '../../hooks/useSessionRenewal'
import { useHasSession } from '../../hooks/useSession'
import { usePreferencesSync } from '../../hooks/usePreferencesSync'

function AuthenticatedArea() {
  useSessionRenewal()
  usePreferencesSync()
  return <Outlet />
}

export function RequireAuth() {
  return useHasSession() ? <AuthenticatedArea /> : <Navigate to="/login" replace />
}

export function PublicOnly() {
  return useHasSession() ? <Navigate to="/" replace /> : <Outlet />
}
