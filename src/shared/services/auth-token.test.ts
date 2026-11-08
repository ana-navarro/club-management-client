import { expect, it, jest } from '@jest/globals'
import {
  clearSession,
  clearSessionNotice,
  getToken,
  readSession,
  readSessionNotice,
  saveSession,
  subscribeToSession,
} from './auth-token'

const session = { token: 'jwt', expiresAt: '2026-01-01T12:00:00Z', renewAt: '2026-01-01T11:30:00Z' }

it('saves, reads and clears the session in sessionStorage', () => {
  expect(getToken()).toBeNull()
  saveSession(session)
  expect(getToken()).toBe('jwt')
  expect(readSession()).toEqual(session)
  expect(localStorage.length).toBe(0)
  clearSession()
  expect(getToken()).toBeNull()
})

it.each(['{', '{"token":1}'])('tolerates the corrupted value %s', (value) => {
  sessionStorage.setItem('session', value)
  expect(readSession()).toBeNull()
})

it('notifies subscribers until they leave', () => {
  const listener = jest.fn()
  const leave = subscribeToSession(listener)
  saveSession(session)
  expect(listener).toHaveBeenCalledTimes(1)
  leave()
  clearSession()
  expect(listener).toHaveBeenCalledTimes(1)
})

it('keeps a notice only when the session expired', () => {
  saveSession(session)
  clearSession()
  expect(readSessionNotice()).toBeNull()
  clearSession('expired')
  expect(readSessionNotice()).toBe('expired')
  clearSessionNotice()
  expect(readSessionNotice()).toBeNull()
})
