import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals'
import { act, fireEvent, renderHook } from '@testing-library/react'
import { readSession, readSessionNotice, saveSession } from '../services/auth-token'
import { useSessionRenewal } from './useSessionRenewal'

const NOW = new Date('2026-01-01T10:00:00Z').getTime()
const MINUTE = 60 * 1000

const iso = (ms: number) => new Date(ms).toISOString()
const session = {
  token: 'old',
  expiresAt: iso(NOW + 120 * MINUTE),
  renewAt: iso(NOW + 90 * MINUTE),
}
const renewed = {
  token: 'new',
  expiresAt: iso(NOW + 215 * MINUTE),
  renewAt: iso(NOW + 185 * MINUTE),
}

const flush = async () => {
  await act(async () => {
    await jest.advanceTimersByTimeAsync(0)
  })
}

describe('useSessionRenewal', () => {
  let fetchMock: jest.Mock<typeof fetch>

  beforeEach(() => {
    jest.useFakeTimers({ now: NOW })
    fetchMock = jest.fn<typeof fetch>(async () => new Response(JSON.stringify(renewed), { status: 200 }))
    globalThis.fetch = fetchMock
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  const start = () => {
    saveSession(session)
    return renderHook(() => useSessionRenewal())
  }

  it('does not renew activity before the renewal time', async () => {
    start()
    fireEvent.click(window)
    await flush()
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('renews on activity after the renewal time, keeping the user in', async () => {
    start()
    act(() => {
      jest.advanceTimersByTime(95 * MINUTE)
    })
    fireEvent.keyDown(window)
    await flush()

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/auth/refresh',
      expect.objectContaining({ headers: { Authorization: 'Bearer old' } }),
    )
    expect(readSession()).toEqual(renewed)

    act(() => {
      jest.advanceTimersByTime(30 * MINUTE)
    })
    expect(readSession()).toEqual(renewed)
  })

  it('makes a single call at a time', async () => {
    start()
    act(() => {
      jest.advanceTimersByTime(95 * MINUTE)
    })
    fireEvent.click(window)
    fireEvent.click(window)
    fireEvent.scroll(window)
    await flush()
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('does not renew when idle, and ends the session at the expiry', async () => {
    start()
    await act(async () => {
      await jest.advanceTimersByTimeAsync(120 * MINUTE)
    })
    expect(fetchMock).not.toHaveBeenCalled()
    expect(readSession()).toBeNull()
    expect(readSessionNotice()).toBe('expired')
  })

  it('does not ask for a renewal at the session limit', async () => {
    saveSession({ ...session, renewAt: session.expiresAt })
    renderHook(() => useSessionRenewal())
    act(() => {
      jest.advanceTimersByTime(119 * MINUTE)
    })
    fireEvent.click(window)
    await flush()
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('keeps the session and tries again after a network failure', async () => {
    fetchMock.mockImplementationOnce(async () => {
      throw new TypeError('offline')
    })
    start()
    act(() => {
      jest.advanceTimersByTime(95 * MINUTE)
    })
    fireEvent.click(window)
    await flush()
    expect(readSession()).toEqual(session)

    fireEvent.click(window)
    await flush()
    expect(readSession()).toEqual(renewed)
  })

  it('ends the session when the renewal is refused', async () => {
    fetchMock.mockImplementationOnce(async () => new Response('{"error":"invalid_token"}', { status: 401 }))
    start()
    act(() => {
      jest.advanceTimersByTime(95 * MINUTE)
    })
    fireEvent.click(window)
    await flush()
    expect(readSession()).toBeNull()
  })

  it('does not end the session at once when the expiry is very far away', async () => {
    saveSession({ ...session, expiresAt: '2999-01-01T00:00:00Z', renewAt: '2999-01-01T00:00:00Z' })
    renderHook(() => useSessionRenewal())
    await act(async () => {
      await jest.advanceTimersByTimeAsync(60 * MINUTE)
    })
    expect(readSession()).not.toBeNull()
  })

  it('does nothing without a session', () => {
    renderHook(() => useSessionRenewal())
    fireEvent.click(window)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('stops listening when unmounted', async () => {
    const { unmount } = start()
    unmount()
    act(() => {
      jest.advanceTimersByTime(95 * MINUTE)
    })
    fireEvent.click(window)
    await flush()
    expect(fetchMock).not.toHaveBeenCalled()
  })
})
