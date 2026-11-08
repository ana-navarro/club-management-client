import { useSyncExternalStore } from 'react'
import { readSession, readSessionRaw, subscribeToSession, type StoredSession } from '../services/auth-token'

export function useHasSession(): boolean {
  return useSyncExternalStore(subscribeToSession, () => readSessionRaw() !== null)
}

export function useSession(): StoredSession | null {
  // The raw text is the snapshot: a new parsed object on each read would never settle.
  const raw = useSyncExternalStore(subscribeToSession, readSessionRaw)
  return raw === null ? null : readSession()
}
