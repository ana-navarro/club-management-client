import { z } from 'zod'

export const storedSessionSchema = z.object({
  token: z.string(),
  expiresAt: z.string(),
  renewAt: z.string(),
})

export type StoredSession = z.infer<typeof storedSessionSchema>
export type SessionEnd = 'expired'

const SESSION_KEY = 'session'
const NOTICE_KEY = 'sessionNotice'

const listeners = new Set<() => void>()
const notify = () => listeners.forEach((listener) => listener())

export function subscribeToSession(listener: () => void): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function readSessionRaw(): string | null {
  return sessionStorage.getItem(SESSION_KEY)
}

export function readSession(): StoredSession | null {
  const raw = readSessionRaw()
  if (!raw) return null
  try {
    return storedSessionSchema.parse(JSON.parse(raw))
  } catch {
    return null
  }
}

export function getToken(): string | null {
  return readSession()?.token ?? null
}

export function saveSession(session: StoredSession): void {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session))
  notify()
}

export function clearSession(reason?: SessionEnd): void {
  sessionStorage.removeItem(SESSION_KEY)
  if (reason) sessionStorage.setItem(NOTICE_KEY, reason)
  notify()
}

export function readSessionNotice(): SessionEnd | null {
  return sessionStorage.getItem(NOTICE_KEY) === 'expired' ? 'expired' : null
}

export function clearSessionNotice(): void {
  sessionStorage.removeItem(NOTICE_KEY)
}
