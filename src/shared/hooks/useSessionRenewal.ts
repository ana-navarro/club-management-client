import { useEffect, useRef } from 'react'
import { clearSession, readSession, saveSession, storedSessionSchema } from '../services/auth-token'
import { postJson } from '../services/http-client'
import { useSession } from './useSession'

const ACTIVITY_EVENTS: (keyof WindowEventMap)[] = ['click', 'touchstart', 'keydown', 'scroll']
// Browsers run a longer timer immediately.
const MAXIMUM_TIMER_MS = 2 ** 31 - 1

// Renews on activity from the time the backend says, and ends the session at its expiry.
export function useSessionRenewal(): void {
  const session = useSession()
  const expiresAt = session?.expiresAt
  const renewAt = session?.renewAt
  const renewing = useRef(false)

  useEffect(() => {
    if (!expiresAt || !renewAt) return undefined

    const renewalTime = new Date(renewAt).getTime()
    const expiryTime = new Date(expiresAt).getTime()

    const onActivity = () => {
      const now = Date.now()
      if (renewing.current || now < renewalTime || renewalTime >= expiryTime || now >= expiryTime) return
      renewing.current = true
      postJson('/auth/refresh', storedSessionSchema)
        .then((renewed) => {
          if (readSession()) saveSession(renewed)
        })
        // A failed call is not an expiry. Another activity tries again, and a 401 ends the session.
        .catch(() => undefined)
        .finally(() => {
          renewing.current = false
        })
    }

    ACTIVITY_EVENTS.forEach((name) => window.addEventListener(name, onActivity, { passive: true }))
    const delay = Math.min(Math.max(expiryTime - Date.now(), 0), MAXIMUM_TIMER_MS)
    const timer = setTimeout(() => clearSession('expired'), delay)

    return () => {
      ACTIVITY_EVENTS.forEach((name) => window.removeEventListener(name, onActivity))
      clearTimeout(timer)
    }
  }, [expiresAt, renewAt])
}
